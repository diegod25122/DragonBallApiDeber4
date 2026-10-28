import { clearLogs, formatClock, getLogs, log, subscribeLogs } from '../logger';

describe('logs con hora', () => {
  beforeEach(() => {
    clearLogs();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('formatea hora con milisegundos', () => {
    expect(formatClock(new Date(2026, 9, 26, 9, 5, 7, 42))).toBe('09:05:07.042');
  });

  it('guarda el más reciente primero, lo imprime y avisa a los suscriptores', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeLogs(listener);
    log('RED', 'sin conexión', new Date(2026, 9, 26, 20, 0, 0, 0));
    log('MUTACION', 'POST enviado', new Date(2026, 9, 26, 20, 0, 1, 0));
    expect(getLogs().map((e) => e.message)).toEqual(['POST enviado', 'sin conexión']);
    expect(console.log).toHaveBeenCalledWith('[20:00:01.000] [MUTACION] POST enviado');
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    log('APP', 'otro');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('conserva como máximo 200 entradas', () => {
    for (let i = 0; i < 250; i++) log('GET', `n${i}`);
    expect(getLogs()).toHaveLength(200);
    expect(getLogs()[0].message).toBe('n249');
  });
});
