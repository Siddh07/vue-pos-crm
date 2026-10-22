# MockAPI customer backend

## Provision the resource

1. Sign in to [MockAPI](https://mockapi.io) and create a project named `vue-pos-crm`.
2. Create a resource named `customers` to expose `/customers`.
3. Configure these fields to match `src/types/customer.ts`:
   - `id`: resource-generated identifier
   - `name`: string
   - `email`: string
   - `phone`: string
   - `company`: string
   - `status`: string, using `Active`, `Pending`, or `Closed`
   - `dealValue`: number
4. Use the fictional records in [customers.seed.json](customers.seed.json) to
   populate the resource. Send each object separately to the resource's POST
   endpoint, allowing the service to generate its ID.
5. Save the resource URL displayed by MockAPI, including `/customers`, for the
   frontend integration.

Use only fictional customer information in this mock backend.

## Verify the resource

Using the resource URL, verify that GET returns the customer array, POST creates
a customer, PUT updates that customer's ID URL, and DELETE removes the test
customer at that same ID URL. Check that `dealValue` is returned as a number and
that each record has one of the three supported statuses.

## Frontend integration notes

The customer directory currently stores records in memory. Creating this resource
does not enable persistence until the frontend is connected to the API.

The app currently uses numeric IDs. When connecting the backend, inspect the ID
type returned by the service and normalize it at the API boundary or update the
app's ID types consistently. Do not assume generated API IDs are numbers.

The status choices above describe the app's accepted values; the frontend/API
adapter must validate them when reading or writing data.
