import { api } from '../../app/api';
import type {
  BolidSchema,
  BolidPinSchema,
  BolidPinControlRequest,
  BolidPinControlResponse,
  BolidPinsStatusResponse,
} from './types';

export const bolidApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBolids: builder.query<BolidSchema[], void>({
      query: () => '/bolid',
      providesTags: ['Bolid'],
    }),

    getBolidPins: builder.query<BolidPinSchema[], void>({
      query: () => '/bolid_pins',
      providesTags: ['Bolid'],
    }),

    getBolidPinsStatus: builder.query<BolidPinsStatusResponse, string>({
      query: (bolid_name) => `/bolid_pins/status/${bolid_name}`,
      providesTags: (_r, _e, bolid_name) => [{ type: 'Bolid', id: bolid_name }],
    }),

    controlPin: builder.mutation<BolidPinControlResponse, BolidPinControlRequest>({
      query: (data) => {
        const params = new URLSearchParams();
        params.set('hostname', data.hostname);
        params.set('state', String(data.state));
        params.set('bolid_name', data.bolid_name);
        return {
          url: '/bolid_pins/control',
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: (_r, _e, args) => [
        { type: 'Bolid', id: args.bolid_name },
        'Devices',
      ],
    }),
  }),
});

export const {
  useGetBolidsQuery,
  useGetBolidPinsQuery,
  useGetBolidPinsStatusQuery,
  useControlPinMutation,
} = bolidApi;
