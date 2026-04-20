import { api } from '../../app/api';
import type {
  DeviceSchema,
  DeviceUpdateRequest,
  DeviceFilters,
  ReservationSchema,
  CreateReservationRequest,
  ReloadDeviceRequest,
} from './types';

export const devicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<DeviceSchema[], DeviceFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          if (filters.types) {
            filters.types.forEach((t) => params.append('types', t));
          }
          if (filters.connection_status) params.set('connection_status', filters.connection_status);
          if (filters.test_stage) params.set('test_stage', filters.test_stage);
          if (filters.type_group) params.set('type_group', filters.type_group);
          if (filters.deactivated !== undefined) params.set('deactivated', String(filters.deactivated));
          if (filters.reservation_status) params.set('reservation_status', filters.reservation_status);
        }
        return `/device_data?${params.toString()}`;
      },
      providesTags: ['Devices'],
    }),

    getDevice: builder.query<DeviceSchema, string>({
      query: (hostname) => `/device_data/${hostname}`,
      providesTags: (_result, _error, hostname) => [{ type: 'Device', id: hostname }],
    }),

    updateDevice: builder.mutation<DeviceSchema, { hostname: string; data: DeviceUpdateRequest }>({
      query: ({ hostname, data }) => ({
        url: `/device_data/${hostname}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { hostname }) => ['Devices', { type: 'Device', id: hostname }],
    }),

    getReservations: builder.query<ReservationSchema[], void>({
      query: () => '/device_reserve',
      providesTags: ['Reservations'],
    }),

    getReservationById: builder.query<ReservationSchema, string>({
      query: (id) => `/device_reserve/by_id?id=${id}`,
    }),

    getReservationByHostname: builder.query<ReservationSchema, string>({
      query: (hostname) => `/device_reserve/by_hostname?hostname=${hostname}`,
    }),

    deleteReservationById: builder.mutation<void, string>({
      query: (id) => ({ url: `/device_reserve/by_id?id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Reservations', 'Devices'],
    }),

    deleteReservationByHostname: builder.mutation<void, string>({
      query: (hostname) => ({ url: `/device_reserve/by_hostname?hostname=${hostname}`, method: 'DELETE' }),
      invalidatesTags: ['Reservations', 'Devices'],
    }),

    createReservation: builder.mutation<ReservationSchema, CreateReservationRequest>({
      query: (data) => ({
        url: '/device_reserve',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reservations', 'Devices'],
    }),

    reloadDevice: builder.mutation<{ task_id: string }, ReloadDeviceRequest>({
      query: (data) => ({
        url: '/install/reload',
        method: 'POST',
        body: data,
      }),
    }),

    controlBolidPin: builder.mutation<void, { hostname: string; state: number; bolid_name: string }>({
      query: (data) => ({
        url: '/bolid_pins/control',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Devices'],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceQuery,
  useUpdateDeviceMutation,
  useGetReservationsQuery,
  useGetReservationByIdQuery,
  useLazyGetReservationByIdQuery,
  useGetReservationByHostnameQuery,
  useLazyGetReservationByHostnameQuery,
  useDeleteReservationByIdMutation,
  useDeleteReservationByHostnameMutation,
  useCreateReservationMutation,
  useReloadDeviceMutation,
  useControlBolidPinMutation,
} = devicesApi;