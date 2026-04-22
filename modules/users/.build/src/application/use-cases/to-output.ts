import type { User } from '../../domain/entities/user.entity';
import type { UserOutput } from '../dtos/user.dto';

export function toOutput(user: User): UserOutput {
  const snap = user.toSnapshot();
  return {
    id: snap.id,
    tenantId: snap.tenantId,
    name: snap.name,
    email: snap.email,
    role: snap.role,
    active: snap.active,
    createdAt: snap.createdAt.toISOString(),
  };
}
