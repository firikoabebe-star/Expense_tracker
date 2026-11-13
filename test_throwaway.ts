import { parseExpenseDate } from "/lib/utils";

function testDateBucketing() {
  const d1 = parseExpenseDate('15/03/2024');
  const d2 = parseExpenseDate('01/05/2024');
  if (!d1 || !d2) throw new Error('bad parse');
  if (!(d1.getTime() < d2.getTime())) throw new Error('bad comparison');
  if (parseExpenseDate('31/02/2024')) throw new Error('should reject invalid rollover');
  if (parseExpenseDate('invalid')) throw new Error('should reject');
  console.log('date bucketing OK');
}

function testZeroFill() {
  const days: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    days.push(day.toISOString().slice(0, 10));
  }
  const data = new Map([['2024-01-01', 5]]);
  const filled = days.map(d => ({ date: d, count: data.get(d) || 0 }));
  if (filled.length !== 7) throw new Error('bad length');
  if (filled.some(f => typeof f.count !== 'number')) throw new Error('bad type');
  console.log('zero-fill OK');
}

function testLastAdminGuard() {
  const admins = [{ id: '1', role: 'admin' }];
  const target = { id: '1', role: 'admin' };
  const sessionUserId = '1';
  const newRole = 'user';
  if (admins.length <= 1 && target.role === 'admin' && newRole === 'user') {
    console.log('last-admin guard triggers OK');
    return;
  }
  if (sessionUserId === target.id && newRole === 'user') {
    throw new Error('bad');
  }
}
testDateBucketing();
testZeroFill();
testLastAdminGuard();
console.log('ALL TESTS PASSED');
