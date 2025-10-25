import { type NoIdObjectSkeletonInterface } from '../api/ApiTypes';
import {
  deleteOAuth2Client as _deleteOAuth2Client,
  getOAuth2Client as _getOAuth2Client,
  getOAuth2Clients as _getOAuth2Clients,
  type OAuth2ClientSkeleton,
  putOAuth2Client as _putOAuth2Client,
} from '../api/OAuth2ClientApi';
import { type ScriptSkeleton } from '../api/ScriptApi';
import { State } from '../shared/State';
import {
  createProgressIndicator,
  debugMessage,
  printMessage,
  stopProgressIndicator,
  updateProgressIndicator,
} from '../utils/Console';
import {
  convertBase64TextToArray,
  getMetadata,
} from '../utils/ExportImportUtils';
import { getCurrentRealmName } from '../utils/ForgeRockUtils';
import { FrodoError } from './FrodoError';
import { readOAuth2Provider } from './OAuth2ProviderOps';
import { ExportMetaData } from './OpsTypes';
import { readScript, updateScript } from './ScriptOps';

export type OAuth2Client = {
  /**
   * Create an empty OAuth2 client export template
   * @returns {OAuth2ClientExportInterface} an empty OAuth2 client export template
   */
  createOAuth2ClientExportTemplate(): OAuth2ClientExportInterface;
  /**
   * Read all OAuth2 clients
   * @returns {Promise<OAuth2ClientSkeleton[]>} a promise that resolves to an array of oauth2client objects
   */
  readOAuth2Clients(): Promise<OAuth2ClientSkeleton[]>;
  /**
   * Read OAuth2 client
   * @param {string} clientId client id
   * @returns {Promise<OAuth2ClientSkeleton>} a promise that resolves to an oauth2client object
   */
  readOAuth2Client(clientId: string): Promise<OAuth2ClientSkeleton>;
  /**
   * Create OAuth2 client
   * @param {string} clientId client id
   * @param {any} clientData oauth2client object
   * @returns {Promise<OAuth2ClientSkeleton>} a promise that resolves to an oauth2client object
   */
  createOAuth2Client(
    clientId: string,
    clientData: OAuth2ClientSkeleton
  ): Promise<OAuth2ClientSkeleton>;
  /**
   * Update or create OAuth2 client
   * @param {string} clientId client id
   * @param {any} clientData oauth2client object
   * @returns {Promise<any>} a promise that resolves to an oauth2client object
   */
  updateOAuth2Client(
    clientId: string,
    clientData: OAuth2ClientSkeleton
  ): Promise<OAuth2ClientSkeleton>;
  /**
   * Delete all OAuth2 clients
   * @returns {Promise<OAuth2ClientSkeleton[]>} a promise that resolves to an array of oauth2client objects
   */
  deleteOAuth2Clients(): Promise<OAuth2ClientSkeleton[]>;
  /**
   * Delete OAuth2 client
   * @param {string} clientId client id
   * @returns {Promise<OAuth2ClientSkeleton>} a promise that resolves to an oauth2client object
   */
  deleteOAuth2Client(clientId: string): Promise<OAuth2ClientSkeleton>;
  /**
   * Export all OAuth2 clients
   * @param {OAuth2ClientExportOptions} options export options
   * @returns {OAuth2ClientExportInterface} export data
   */
  exportOAuth2Clients(
    options?: OAuth2ClientExportOptions
  ): Promise<OAuth2ClientExportInterface>;
  /**
   * Export OAuth2 client by ID
   * @param {string} clientId oauth2 client id
   * @param {OAuth2ClientExportOptions} options export options
   * @returns {OAuth2ClientExportInterface} export data
   */
  exportOAuth2Client(
    clientId: string,
    options?: OAuth2ClientExportOptions
  ): Promise<OAuth2ClientExportInterface>;
  /**
   * Import OAuth2 Client by ID
   * @param {string} clientId client id
   * @param {OAuth2ClientExportInterface} importData import data
   * @param {OAuth2ClientImportOptions} options import options
   * @returns {Promise<OAuth2ClientSkeleton>} a promise resolving to an oauth2 client
   */
  importOAuth2Client(
    clientId: string,
    importData: OAuth2ClientExportInterface,
    options?: OAuth2ClientImportOptions
  ): Promise<OAuth2ClientSkeleton>;
  /**
   * Import first OAuth2 Client
   * @param {OAuth2ClientExportInterface} importData import data
   * @param {OAuth2ClientImportOptions} options import options
   * @returns {Promise<OAuth2ClientSkeleton>} a promise resolving to an oauth2 client
   */
  importFirstOAuth2Client(
    importData: OAuth2ClientExportInterface,
    options?: OAuth2ClientImportOptions
  ): Promise<OAuth2ClientSkeleton>;
  /**
   * Import OAuth2 Clients
   * @param {OAuth2ClientExportInterface} importData import data
   * @param {OAuth2ClientImportOptions} options import options
   * @returns {Promise<OAuth2ClientSkeleton[]>} a promise resolving to an array of oauth2 clients
   */
  importOAuth2Clients(
    importData: OAuth2ClientExportInterface,
    options?: OAuth2ClientImportOptions
  ): Promise<OAuth2ClientSkeleton[]>;

  // Deprecated

  /**
   * Get all OAuth2 clients
   * @returns {Promise<OAuth2ClientSkeleton[]>} a promise that resolves to an array of oauth2client objects
   * @deprecated since v2.0.0 use {@link OAuth2Client.readOAuth2Clients | readOAuth2Clients} instead
   * ```javascript
   * readOAuth2Clients(): Promise<OAuth2ClientSkeleton[]>
   * ```
   * @group Deprecated
   */
  getOAuth2Clients(): Promise<OAuth2ClientSkeleton[]>;
  /**
   * Get OAuth2 client
   * @param {string} clientId client id
   * @returns {Promise<OAuth2ClientSkeleton>} a promise that resolves to an oauth2client object
   * @deprecated since v2.0.0 use {@link OAuth2Client.readOAuth2Client | readOAuth2Client} instead
   * ```javascript
   * readOAuth2Client(clientId: string): Promise<OAuth2ClientSkeleton>
   * ```
   * @group Deprecated
   */
  getOAuth2Client(clientId: string): Promise<OAuth2ClientSkeleton>;
  /**
   * Put OAuth2 client
   * @param {string} clientId client id
   * @param {OAuth2ClientSkeleton} clientData oauth2client object
   * @returns {Promise<any>} a promise that resolves to an oauth2client object
   * @deprecated since v2.0.0 use {@link OAuth2Client.updateOAuth2Client | updateOAuth2Client} or {@link OAuth2Client.createOAuth2Client | createOAuth2Client} instead
   * ```javascript
   * updateOAuth2Client(clientId: string, clientData: OAuth2ClientSkeleton): Promise<OAuth2ClientSkeleton>
   * createOAuth2Client(clientId: string, clientData: OAuth2ClientSkeleton): Promise<OAuth2ClientSkeleton>
   * ```
   * @group Deprecated
   */
  putOAuth2Client(
    clientId: string,
    clientData: OAuth2ClientSkeleton
  ): Promise<OAuth2ClientSkeleton>;
};

export default (state: State): OAuth2Client => {
  return {
    createOAuth2ClientExportTemplate(): OAuth2ClientExportInterface {
      return createOAuth2ClientExportTemplate({ state });
    },
    async readOAuth2Clients(): Promise<OAuth2ClientSkeleton[]> {
      return readOAuth2Clients({ state });
    },
    async readOAuth2Client(clientId: string): Promise<OAuth2ClientSkeleton> {
      return readOAuth2Client({ clientId, state });
    },
    async createOAuth2Client(
      clientId: string,
      clientData: OAuth2ClientSkeleton
    ): Promise<OAuth2ClientSkeleton> {
      return createOAuth2Client({ clientId, clientData, state });
    },
    async updateOAuth2Client(
      clientId: string,
      clientData: OAuth2ClientSkeleton
    ): Promise<OAuth2ClientSkeleton> {
      return updateOAuth2Client({ clientId, clientData, state });
    },
    async deleteOAuth2Clients(): Promise<OAuth2ClientSkeleton[]> {
      return deleteOAuth2Clients({ state });
    },
    async deleteOAuth2Client(clientId: string): Promise<OAuth2ClientSkeleton> {
      return deleteOAuth2Client({ clientId, state });
    },
    async exportOAuth2Clients(
      options: OAuth2ClientExportOptions = { useStringArrays: true, deps: true }
    ): Promise<OAuth2ClientExportInterface> {
      return exportOAuth2Clients({ options, state });
    },
    async exportOAuth2Client(
      clientId: string,
      options: OAuth2ClientExportOptions = { useStringArrays: true, deps: true }
    ): Promise<OAuth2ClientExportInterface> {
      return exportOAuth2Client({ clientId, options, state });
    },
    async importOAuth2Client(
      clientId: string,
      importData: OAuth2ClientExportInterface,
      options: OAuth2ClientImportOptions = { deps: true }
    ) {
      return importOAuth2Client({
        clientId,
        importData,
        options,
        state,
      });
    },
    async importFirstOAuth2Client(
      importData: OAuth2ClientExportInterface,
      options: OAuth2ClientImportOptions = { deps: true }
    ) {
      return importFirstOAuth2Client({ importData, options, state });
    },
    async importOAuth2Clients(
      importData: OAuth2ClientExportInterface,
      options: OAuth2ClientImportOptions = { deps: true }
    ): Promise<OAuth2ClientSkeleton[]> {
      return importOAuth2Clients({ importData, options, state });
    },

    // Deprecated

    async getOAuth2Clients(): Promise<OAuth2ClientSkeleton[]> {
      return readOAuth2Clients({ state });
    },
    async getOAuth2Client(clientId: string): Promise<OAuth2ClientSkeleton> {
      return readOAuth2Client({ clientId, state });
    },
    async putOAuth2Client(
      clientId: string,
      clientData: OAuth2ClientSkeleton
    ): Promise<OAuth2ClientSkeleton> {
      return updateOAuth2Client({ clientId, clientData, state });
    },
  };
};

/**
 * OAuth2 client export options
 */
export interface OAuth2ClientExportOptions {
  /**
   * Use string arrays to store multi-line text in scripts.
   */
  useStringArrays: boolean;
  /**
   * Include any dependencies (scripts).
   */
  deps: boolean;
}

/**
 * OAuth2 client import options
 */
export interface OAuth2ClientImportOptions {
  /**
   * Include any dependencies (scripts).
   */
  deps: boolean;
}

export interface OAuth2ClientExportInterface {
  meta?: ExportMetaData;
  script?: Record<string, ScriptSkeleton>;
  application: Record<string, OAuth2ClientSkeleton>;
}

/**
 * Create an empty OAuth2 client export template
 * @returns {OAuth2ClientExportInterface} an empty OAuth2 client export template
 */
export function createOAuth2ClientExportTemplate({
  state,
}: {
  state: State;
}): OAuth2ClientExportInterface {
  return {
    meta: getMetadata({ state }),
    script: {},
    application: {},
  } as OAuth2ClientExportInterface;
}

/**
 * Get all OAuth2 clients
 * @returns {Promise<OAuth2ClientSkeleton[]>} a promise that resolves to an array of oauth2client objects
 */
export async function readOAuth2Clients({
  state,
}: {
  state: State;
}): Promise<OAuth2ClientSkeleton[]> {
  try {
    const clients = (await _getOAuth2Clients({ state })).result;
    return clients;
  } catch (error) {
    if (
      error.response?.status === 403 &&
      error.response?.data?.message ===
        'This operation is not available in PingOne Advanced Identity Cloud.'
    ) {
      return [];
    } else {
      throw new FrodoError(
        `Error reading ${getCurrentRealmName(state) + ' realm'} oauth2 clients`,
        error
      );
    }
  }
}

/**
 * Get OAuth2 client
 * @param {string} clientId client id
 * @returns {Promise<any>} a promise that resolves to an oauth2client object
 */
export async function readOAuth2Client({
  clientId,
  state,
}: {
  clientId: string;
  state: State;
}): Promise<OAuth2ClientSkeleton> {
  try {
    return _getOAuth2Client({ id: clientId, state });
  } catch (error) {
    throw new FrodoError(
      `Error reading ${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId}`,
      error
    );
  }
}

/**
 * Create OAuth2 client
 * @param {string} clientId client id
 * @param {any} clientData oauth2client object
 * @returns {Promise<OAuth2ClientSkeleton>} a promise that resolves to an oauth2client object
 */
export async function createOAuth2Client({
  clientId,
  clientData,
  state,
}: {
  clientId: string;
  clientData: OAuth2ClientSkeleton | NoIdObjectSkeletonInterface;
  state: State;
}): Promise<OAuth2ClientSkeleton> {
  debugMessage({ message: `OAuth2ClientOps.createOAuth2Client: start`, state });
  try {
    await readOAuth2Client({ clientId, state });
  } catch (error) {
    try {
      const result = await updateOAuth2Client({
        clientId,
        clientData,
        state,
      });
      debugMessage({
        message: `OAuth2ClientOps.createOAuth2Client: end`,
        state,
      });
      return result;
    } catch (error) {
      throw new FrodoError(
        `Error creating ${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId}`,
        error
      );
    }
  }
  throw new FrodoError(
    `${getCurrentRealmName(state) + ' realm'} oAuth2 client ${clientId} already exists!`
  );
}

/**
 * Update or create OAuth2 client
 * @param {string} clientId client id
 * @param {any} clientData oauth2client object
 * @returns {Promise<OAuth2ClientSkeleton>} a promise that resolves to an oauth2client object
 */
export async function updateOAuth2Client({
  clientId,
  clientData,
  state,
}: {
  clientId: string;
  clientData: OAuth2ClientSkeleton | NoIdObjectSkeletonInterface;
  state: State;
}): Promise<OAuth2ClientSkeleton> {
  debugMessage({ message: `OAuth2ClientOps.putOAuth2Client: start`, state });
  try {
    const response = await _putOAuth2Client({
      id: clientId,
      clientData,
      state,
    });
    debugMessage({ message: `OAuth2ClientOps.putOAuth2Client: end`, state });
    return response;
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message === 'Invalid attribute specified.'
    ) {
      try {
        const { validAttributes } = error.response.data.detail;
        validAttributes.push('_id');
        for (const key of Object.keys(clientData)) {
          if (typeof clientData[key] === 'object') {
            for (const attribute of Object.keys(clientData[key])) {
              if (!validAttributes.includes(attribute)) {
                if (state.getVerbose() || state.getDebug())
                  printMessage({
                    message: `\n- Removing invalid attribute: ${key}.${attribute}`,
                    type: 'warn',
                    state,
                  });
                delete clientData[key][attribute];
              }
            }
          }
        }
        const response = await _putOAuth2Client({
          id: clientId,
          clientData,
          state,
        });
        debugMessage({
          message: `OAuth2ClientOps.putOAuth2Client: end`,
          state,
        });
        return response;
      } catch (error) {
        throw new FrodoError(
          `Error updating ${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId}`,
          error
        );
      }
    } else {
      throw new FrodoError(
        `Error updating ${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId}`,
        error
      );
    }
  }
}

/**
 * Delete all OAuth2 clients
 * @param {string} clientId client id
 * @returns {Promise<OAuth2ClientSkeleton[]>} a promise that resolves to an oauth2client object
 */
export async function deleteOAuth2Clients({
  state,
}: {
  state: State;
}): Promise<OAuth2ClientSkeleton[]> {
  debugMessage({
    message: `OAuth2ClientOps.deleteOAuth2Clients: start`,
    state,
  });
  const result: OAuth2ClientSkeleton[] = [];
  const errors = [];
  try {
    const clients = await readOAuth2Clients({ state });
    for (const client of clients) {
      try {
        debugMessage({
          message: `OAuth2ClientOps.deleteOAuth2Clients: '${client._id}'`,
          state,
        });
        result.push(
          await deleteOAuth2Client({
            clientId: client._id,
            state,
          })
        );
      } catch (error) {
        errors.push(error);
      }
    }
  } catch (error) {
    errors.push(error);
  }
  if (errors.length) {
    throw new FrodoError(
      `Error deleting ${getCurrentRealmName(state) + ' realm'} oauth2 clients`,
      errors
    );
  }
  debugMessage({
    message: `OAuth2ClientOps.deleteOAuth2Clients: end`,
    state,
  });
  return result;
}

/**
 * Delete OAuth2 client
 * @param {string} clientId client id
 * @returns {Promise<OAuth2ClientSkeleton>} a promise that resolves to an oauth2client object
 */
export async function deleteOAuth2Client({
  clientId,
  state,
}: {
  clientId: string;
  state: State;
}): Promise<OAuth2ClientSkeleton> {
  try {
    return _deleteOAuth2Client({ id: clientId, state });
  } catch (error) {
    throw new FrodoError(
      `Error deleting ${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId}`,
      error
    );
  }
}

/**
 * Helper function to export dependencies of an OAuth2 Client
 * @param {unknown} clientData oauth2 client data
 * @param {OAuth2ClientExportOptions} options export options
 * @param {OAuth2ClientExportInterface} exportData export data
 */
async function exportOAuth2ClientDependencies(
  clientData: unknown,
  options: OAuth2ClientExportOptions,
  exportData: OAuth2ClientExportInterface,
  state: State
) {
  debugMessage({
    message: `OAuth2ClientOps.exportOAuth2ClientDependencies: start [client=${clientData['_id']}]`,
    state,
  });
  if (clientData['overrideOAuth2ClientConfig']) {
    for (const key of Object.keys(clientData['overrideOAuth2ClientConfig'])) {
      if (key.endsWith('Script')) {
        const scriptId = clientData['overrideOAuth2ClientConfig'][key];
        if (scriptId !== '[Empty]' && !exportData.script[scriptId]) {
          try {
            debugMessage({
              message: `- ${scriptId} referenced by ${clientData['_id']}`,
              state,
            });
            const scriptData = await readScript({ scriptId, state });
            if (options.useStringArrays)
              scriptData.script = convertBase64TextToArray(
                scriptData.script as string
              );
            exportData.script[scriptId] = scriptData;
          } catch (error) {
            if (
              !(
                (error as FrodoError).httpStatus === 403 &&
                (error as FrodoError).httpMessage ===
                  'This operation is not available in PingOne Advanced Identity Cloud.'
              )
            ) {
              throw new FrodoError(
                `Error retrieving ${getCurrentRealmName(state) + ' realm'} script ${scriptId} referenced by ${key} key in client ${clientData['_id']}`,
                error
              );
            }
          }
        }
      }
    }
  }
  debugMessage({
    message: `OAuth2ClientOps.exportOAuth2ClientDependencies: end`,
    state,
  });
}

/**
 * Export all OAuth2 clients
 * @param {OAuth2ClientExportOptions} options export options
 * @returns {Promise<OAuth2ClientExportInterface>} export data
 */
export async function exportOAuth2Clients({
  options = { useStringArrays: true, deps: true },
  state,
}: {
  options?: OAuth2ClientExportOptions;
  state: State;
}): Promise<OAuth2ClientExportInterface> {
  debugMessage({
    message: `OAuth2ClientOps.exportOAuth2Clients: start`,
    state,
  });
  const exportData = createOAuth2ClientExportTemplate({ state });
  const errors = [];
  let indicatorId: string;
  try {
    const provider = await readOAuth2Provider({ state });
    const clients = await readOAuth2Clients({ state });
    indicatorId = createProgressIndicator({
      total: clients.length,
      message: `Exporting ${getCurrentRealmName(state) + ' realm'} OAuth2 clients...`,
      state,
    });
    for (const client of clients) {
      updateProgressIndicator({
        id: indicatorId,
        message: `Exporting ${getCurrentRealmName(state) + ' realm'} OAuth2 client ${client._id}`,
        state,
      });
      try {
        client._provider = provider;
        exportData.application[client._id] = client;
        if (options.deps) {
          await exportOAuth2ClientDependencies(
            client,
            options,
            exportData,
            state
          );
        }
      } catch (error) {
        errors.push(error);
      }
    }
    stopProgressIndicator({
      id: indicatorId,
      message: `Exported ${clients.length} ${getCurrentRealmName(state) + ' realm'} OAuth2 clients.`,
      state,
    });
  } catch (error) {
    errors.push(error);
  }
  if (errors.length > 0) {
    throw new FrodoError(
      `Error exporting ${getCurrentRealmName(state) + ' realm'} oauth2 clients`,
      errors
    );
  }
  debugMessage({ message: `OAuth2ClientOps.exportOAuth2Clients: end`, state });
  return exportData;
}

/**
 * Export OAuth2 client by ID
 * @param {string} clientId oauth2 client id
 * @param {OAuth2ClientExportOptions} options export options
 * @returns {Promise<OAuth2ClientExportInterface>} export data
 */
export async function exportOAuth2Client({
  clientId,
  options = { useStringArrays: true, deps: true },
  state,
}: {
  clientId: string;
  options?: OAuth2ClientExportOptions;
  state: State;
}): Promise<OAuth2ClientExportInterface> {
  debugMessage({ message: `OAuth2ClientOps.exportOAuth2Client: start`, state });
  const exportData = createOAuth2ClientExportTemplate({ state });
  const errors = [];
  try {
    const clientData = await readOAuth2Client({ clientId, state });
    clientData._provider = await readOAuth2Provider({ state });
    exportData.application[clientData._id] = clientData;
    if (options.deps) {
      await exportOAuth2ClientDependencies(
        clientData,
        options,
        exportData,
        state
      );
    }
  } catch (error) {
    errors.push(error);
  }
  if (errors.length > 0) {
    throw new FrodoError(
      `Error exporting ${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId}`,
      errors
    );
  }
  debugMessage({ message: `OAuth2ClientOps.exportOAuth2Client: end`, state });
  return exportData;
}

/**
 * Helper function to export dependencies of an OAuth2 Client
 * @param {unknown} clientData oauth2 client data
 * @param {OAuth2ClientExportInterface} importData import data
 */
async function importOAuth2ClientDependencies(
  clientData: unknown,
  importData: OAuth2ClientExportInterface,
  state: State
) {
  if (clientData['overrideOAuth2ClientConfig']) {
    for (const key of Object.keys(clientData['overrideOAuth2ClientConfig'])) {
      if (key.endsWith('Script')) {
        const scriptId = clientData['overrideOAuth2ClientConfig'][key];
        if (
          scriptId !== '[Empty]' &&
          importData.script &&
          importData.script[scriptId]
        ) {
          try {
            const scriptData: ScriptSkeleton = importData.script[scriptId];
            await updateScript({ scriptId, scriptData, state });
          } catch (error) {
            throw new FrodoError(
              `Error importing ${getCurrentRealmName(state) + ' realm'} script dependency ${scriptId}`,
              error
            );
          }
        }
      }
    }
  }
}

/**
 * Import OAuth2 Client by ID
 * @param {string} clientId client id
 * @param {OAuth2ClientExportInterface} importData import data
 * @param {OAuth2ClientImportOptions} options import options
 * @returns {Promise<OAuth2ClientSkeleton>} a promise resolving to an oauth2 client
 */
export async function importOAuth2Client({
  clientId,
  importData,
  options = { deps: true },
  state,
}: {
  clientId: string;
  importData: OAuth2ClientExportInterface;
  options?: OAuth2ClientImportOptions;
  state: State;
}): Promise<OAuth2ClientSkeleton> {
  let response = null;
  const errors = [];
  const imported = [];
  for (const id of Object.keys(importData.application)) {
    if (id === clientId) {
      try {
        const clientData = importData.application[id];
        delete clientData._provider;
        delete clientData._rev;
        if (options.deps) {
          await importOAuth2ClientDependencies(clientData, importData, state);
        }
        response = await updateOAuth2Client({
          clientId: id,
          clientData,
          state,
        });
        imported.push(id);
      } catch (error) {
        errors.push(error);
      }
    }
  }
  if (errors.length > 0) {
    throw new FrodoError(
      `Error importing ${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId}`,
      errors
    );
  }
  if (0 === imported.length) {
    throw new FrodoError(
      `${getCurrentRealmName(state) + ' realm'} oauth2 client ${clientId} not found in import data!`
    );
  }
  return response;
}

/**
 * Import first OAuth2 Client
 * @param {OAuth2ClientExportInterface} importData import data
 * @param {OAuth2ClientImportOptions} options import options
 * @returns {Promise<OAuth2ClientSkeleton>} a promise resolving to an oauth2 client
 */
export async function importFirstOAuth2Client({
  importData,
  options = { deps: true },
  state,
}: {
  importData: OAuth2ClientExportInterface;
  options?: OAuth2ClientImportOptions;
  state: State;
}): Promise<OAuth2ClientSkeleton> {
  let response = null;
  const errors = [];
  const imported = [];
  for (const id of Object.keys(importData.application)) {
    try {
      const clientData = importData.application[id];
      delete clientData._provider;
      delete clientData._rev;
      if (options.deps) {
        await importOAuth2ClientDependencies(clientData, importData, state);
      }
      response = await updateOAuth2Client({ clientId: id, clientData, state });
      imported.push(id);
    } catch (error) {
      errors.push(error);
    }
    break;
  }
  if (errors.length > 0) {
    throw new FrodoError(
      `Error importing first ${getCurrentRealmName(state) + ' realm'} oauth2 client`,
      errors
    );
  }
  if (0 === imported.length) {
    throw new FrodoError(`No oauth2 clients found in import data!`);
  }
  return response;
}

/**
 * Import OAuth2 Clients
 * @param {OAuth2ClientExportInterface} importData import data
 * @param {OAuth2ClientImportOptions} options import options
 * @returns {Promise<OAuth2ClientSkeleton[]>} a promise resolving to an array of oauth2 clients
 */
export async function importOAuth2Clients({
  importData,
  options = { deps: true },
  state,
}: {
  importData: OAuth2ClientExportInterface;
  options?: OAuth2ClientImportOptions;
  state: State;
}): Promise<OAuth2ClientSkeleton[]> {
  const response = [];
  const errors = [];
  for (const id of Object.keys(importData.application)) {
    try {
      const clientData = importData.application[id];
      delete clientData._provider;
      delete clientData._rev;
      if (options.deps) {
        await importOAuth2ClientDependencies(clientData, importData, state);
      }
      response.push(
        await updateOAuth2Client({ clientId: id, clientData, state })
      );
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw new FrodoError(
      `Error importing ${getCurrentRealmName(state) + ' realm'} oauth2 clients`,
      errors
    );
  }
  return response;
}
