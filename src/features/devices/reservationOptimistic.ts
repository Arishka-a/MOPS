import type { DeviceSchema, ReservationSchema, CreateReservationRequest } from './types';
import type { UserSchema } from '../auth/types';

type Patch = { undo: () => void };

type UpdateQueryDataThunk = (...args: unknown[]) => Patch;

export type DevicesApiUtil = {
  updateQueryData: (
    endpointName: 'getDevice',
    arg: string,
    updater: (draft: DeviceSchema) => void
  ) => UpdateQueryDataThunk;
};

type MinimalDispatch = (thunk: UpdateQueryDataThunk) => Patch;

interface LifecycleApi<ReturnType = unknown> {
  dispatch: MinimalDispatch;
  queryFulfilled: Promise<{ data: ReturnType }>;
  getState: () => unknown;
}

async function awaitAndRollback(
  queryFulfilled: Promise<unknown>,
  patches: Patch[]
): Promise<void> {
  try {
    await queryFulfilled;
  } catch {
    patches.forEach((p) => p.undo());
  }
}

export async function optimisticCreateReservation(
  arg: CreateReservationRequest,
  api: LifecycleApi<ReservationSchema>,
  util: DevicesApiUtil
): Promise<void> {
  const hostnames = arg.by_hostname ?? [];
  if (hostnames.length === 0) {
    await awaitAndRollback(api.queryFulfilled, []);
    return;
  }

  const authState = (api.getState() as {
    auth: { user: { username: string; id: string; role: string } | null };
  }).auth;
  const currentUser = authState.user;
  if (!currentUser) {
    await awaitAndRollback(api.queryFulfilled, []);
    return;
  }

  const tempReservation: ReservationSchema = {
    id: `temp-${Date.now()}`,
    user: {
      username: currentUser.username,
      id: currentUser.id,
      role: currentUser.role as UserSchema['role'],
    },
    time_start: arg.time_start ?? null,
    time_end: arg.time_end ?? null,
    devices_hostnames: hostnames,
  };

  const patches: Patch[] = hostnames.map((hostname) =>
    api.dispatch(
      util.updateQueryData('getDevice', hostname, (draft) => {
        draft.reservation = tempReservation;
      })
    )
  );

  await awaitAndRollback(api.queryFulfilled, patches);
}

export async function optimisticDeleteReservationByHostname(
  hostname: string,
  api: LifecycleApi<void>,
  util: DevicesApiUtil
): Promise<void> {
  const patch = api.dispatch(
    util.updateQueryData('getDevice', hostname, (draft) => {
      draft.reservation = null;
    })
  );
  await awaitAndRollback(api.queryFulfilled, [patch]);
}

export async function optimisticDeleteReservationById(
  id: string,
  api: LifecycleApi<void>,
  util: DevicesApiUtil
): Promise<void> {
  const state = api.getState() as {
    api: {
      queries: Record<
        string,
        { endpointName?: string; originalArgs?: unknown; data?: unknown }
      >;
    };
  };

  const patches: Patch[] = [];

  for (const entry of Object.values(state.api.queries)) {
    if (entry?.endpointName !== 'getDevice' || !entry.data) continue;

    const device = entry.data as DeviceSchema;
    if (device.reservation?.id !== id) continue;
    if (typeof entry.originalArgs !== 'string') continue;

    const hostname = entry.originalArgs;
    const patch = api.dispatch(
      util.updateQueryData('getDevice', hostname, (draft) => {
        draft.reservation = null;
      })
    );
    patches.push(patch);
  }

  await awaitAndRollback(api.queryFulfilled, patches);
}
