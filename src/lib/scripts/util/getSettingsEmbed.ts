import Language from '@ayako/bot/src/BaseClient/Other/language';
import buttonParsers from '@ayako/bot/src/BaseClient/UtilModules/settingsHelpers/buttonParsers';
import { DataBaseTables } from '@ayako/bot/src/Typings/DataBase';
import {
 SettingNames,
 SettingsFile,
 SettingsName2TableName
} from '@ayako/bot/src/Typings/Settings';

export default (
 file: SettingsFile<keyof typeof SettingsName2TableName>,
 settings: DataBaseTables[(typeof SettingsName2TableName)[SettingNames]]
) =>
 file.getComponents(buttonParsers, settings, new Language('en-GB'), {
  channels: { cache: { get: () => ({ defaultAutoArchiveDuration: 3000 }) } }
 } as any);
