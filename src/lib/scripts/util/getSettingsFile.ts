import constants from '@ayako/bot/src/BaseClient/Other/constants.js';
import { SettingsFile, SettingsName2TableName } from '@ayako/bot/src/Typings/Settings.js';
import { glob } from 'glob';

export default async <T extends keyof typeof SettingsName2TableName>(settingName: T) => {
 const files = await glob(
  `${process.cwd()}/../../packages/Bot/dist/Commands/SlashCommands/settings/**/*`
 );

 const file = files.find((f) =>
  f.endsWith(
   `/${
    constants.commands.settings.basicSettings.includes(String(settingName))
     ? `${String(settingName)}/basic`
     : String(settingName)
   }.js`
  )
 );
 if (!file) return undefined;

 return (await import(file)) as SettingsFile<T>;
};
