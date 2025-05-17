import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

const getConnection = async () => {
  return SQLite.openDatabase({
    name: 'health.db',
    location: 'default',
  });
};

const createTable = async () => {
  const db = await getConnection();
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      steps INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  );
};

export const getStepData = async () => {
  const db = await getConnection();
  const result = await db.executeSql('SELECT * FROM steps');
  const steps = result[0].rows.raw();
  return steps;
};

export const insertStepData = async (date: string, stepCount: number) => {
  const db = await getConnection();
  await db.executeSql('INSERT INTO steps (date, steps) VALUES (?, ?)', [
    date,
    stepCount,
  ]);
};

export const insertTodayStepsOnLaunch = async (stepCount: number) => {
  const today = new Date().toISOString().split('T')[0];
  const db = await getConnection();
  const existing = await db.executeSql('SELECT * FROM steps WHERE date = ?', [
    today,
  ]);

  if (existing[0].rows.length === 0) {
    await insertStepData(today, stepCount);
  }
};
