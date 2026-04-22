export const USER_LOOKUP = Symbol('USER_LOOKUP');

export interface UserLookup {
  /**
   * Verifies the user is active and belongs to the given tenant. Returns the
   * user's tenant id (always equal to the input when found) or null when RLS
   * hides the row (cross-tenant) or the user is inactive.
   */
  findTenantOfUser(tenantId: string, userId: string): Promise<string | null>;

  /**
   * Resolves a Cognito `sub` claim into the local users.id. The JWT guard hands
   * us the sub but the domain stores the internal id — this bridge is needed
   * for `createdBy` and anywhere else we persist a user reference.
   */
  findUserIdBySub(tenantId: string, sub: string): Promise<string | null>;
}
