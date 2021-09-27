export type AddonStringSetting = string
export type AddonSecretSetting = string
export type AddonNumberSetting = number
export type AddonBooleanSetting = boolean
export type AddonSettingTypes =
  | AddonStringSetting
  | AddonSecretSetting
  | AddonNumberSetting
  | AddonBooleanSetting

export type AddonConfig<T> = {
  readonly [P in keyof T as T[P] extends AddonSettingTypes ? P : never]: T[P]
}

export type MethodStringSetting = string
export type MethodSecretSetting = string
export type MethodNumberSetting = number
export type MethodBooleanSetting = boolean
export type MethodSettingTypes =
  | MethodStringSetting
  | MethodSecretSetting
  | MethodNumberSetting
  | MethodBooleanSetting

export type MethodConfig<T> = {
  readonly [P in keyof T as T[P] extends MethodSettingTypes ? P : never]: T[P]
}
interface AbstractConfig {
  name?: string
  description?: string
}

interface AbstractSettingConfig extends AbstractConfig {
  min?: number
  max?: number
  validator?: (value: any) => Promise<boolean> | boolean
}

interface AddonSettingConfig extends AbstractSettingConfig {}

interface MethodSettingConfig extends AbstractSettingConfig {
  targets: string[]
}

function formatPropertyName(propertyKey: string): string {
  const isUppercase = (s: string) => s === s.toUpperCase()
  let name = ''

  propertyKey.split('').forEach((s: string, index: number) => {
    if (index === 0) {
      name += s.toUpperCase()
    } else if (isUppercase(s)) {
      name += ` ${s.toLowerCase()}`
    } else {
      name += s
    }
  })

  return name
}

function settingConfigParserFactory(config: AbstractSettingConfig = {}) {
  return function (target: any, propertyKey: string) {
    const value = target[propertyKey] ?? null

    const propertyConfig = {
      name: formatPropertyName(propertyKey),
      validator: () => true,
      default: value,
      ...config,
    }

    Object.defineProperty(target, propertyKey, {
      value: value,
      get: () => propertyConfig,
      set: () => {},
      enumerable: true,
      configurable: false,
    })
  }
}

export function AddonSetting(config: AddonSettingConfig) {
  return settingConfigParserFactory(config)
}

export function MethodSetting(config: MethodSettingConfig) {
  return settingConfigParserFactory(config)
}

interface MethodSetupConfig extends AbstractConfig {}

export function Method(config: MethodSetupConfig) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value

    descriptor.value = function () {
      return {
        name: formatPropertyName(propertyKey),
        ...config,
        execute: () => original.apply(this),
      }
    }

    return descriptor
  }
}

function ensureMethodName(
  currentMethodName: string,
  requireMethodName: string
) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (propertyKey === requireMethodName) {
      return descriptor
    }

    throw new Error(
      `${currentMethodName} method MUST be called "${requireMethodName}"`
    )
  }
}

export function SetupMethod() {
  return ensureMethodName('SetupMethod', 'setup')
}
export function BreakDownMethod() {
  return ensureMethodName('BreakDownMethod', 'breakdown')
}

interface AddonSettings {
  name: string
  description?: string
}

export function Addon(settings: AddonSettings) {
  const { name, description = '' } = settings
  return function (constructor: Function) {
    Object.defineProperty(constructor, '__addon', {
      get: () => ({ name, description }),
      enumerable: false,
      writable: false,
    })
  }
}
