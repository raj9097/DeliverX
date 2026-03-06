/**
 * Application Constants
 */

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CLERK: 'clerk',
  DRIVER: 'driver',
  DELIVERY_PERSON: 'delivery_person',
};

const SHIPMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

const DRIVER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  BANNED: 'banned',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

module.exports = {
  ROLES,
  SHIPMENT_STATUS,
  DRIVER_STATUS,
  HTTP_STATUS,
};
