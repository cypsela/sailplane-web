const perms = {
  admin: 'admin',
  write: 'write',
};

function localUserId(sharedFS) {
  return sharedFS.identity.id;
}

function writers(sharedFS) {
  return sharedFS.access.get(perms.write);
}

function admin(sharedFS) {
  return sharedFS.access.get(perms.admin);
}

async function grantWrite(sharedFS, userId) {
  return sharedFS.access.grant(perms.write, userId);
}

function hasWrite(sharedFS, userId = localUserId(sharedFS)) {
  return new Set([...writers(sharedFS), ...admin(sharedFS)]).has(userId);
}

function hasAdmin(sharedFS, userId = localUserId(sharedFS)) {
  return admin(sharedFS).has(userId);
}

export default {localUserId, writers, admin, grantWrite, hasWrite, hasAdmin};
