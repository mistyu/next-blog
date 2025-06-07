import { truncateMySQLTable } from './mysql';
import { truncatePostgresTable } from './postgres';
import { truncateSQLiteTable } from './sqlite';
import { type ConnectorType, ConnectorTypes } from './types';

export function supportedConnector(connector: ConnectorType) {
  return ConnectorTypes.includes(connector);
}

export function getConnectorExtension(connector: ConnectorType) {
  switch (connector) {
    case 'mysql':
      return truncateMySQLTable;
    case 'postgres':
      return truncatePostgresTable;
    case 'sqlite':
      return truncateSQLiteTable;
    default:
      return truncateSQLiteTable;
  }
}
