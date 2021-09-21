import {
  AddonSetting,
  AddonBooleanSetting,
  AddonConfig,
  Method,
  MethodSetting,
  AddonNumberSetting,
  AddonSecretSetting,
  AddonStringSetting,
  MethodStringSetting,
  MethodConfig,
  BreakDownMethod,
  SetupMethod,
  Addon,
  AddonSettingTypes,
} from './addon-package'

@Addon({
  name: 'example',
  description: 'This is some example app',
})
export default class {
  @AddonSetting({
    name: 'Some secret',
    description: 'This is some secret',
    default: 1,
    min: 0,
    max: 150,
    validator: async (s: string) => true,
  })
  valueString!: AddonStringSetting

  @AddonSetting({
    name: 'Some secret',
    description: 'This is some secret',
    default: 1,
    min: 0,
    max: 150,
    validator: async (s: string) => true,
  })
  valueSecret!: AddonSecretSetting

  @AddonSetting({
    name: 'Some number',
    description: 'This is some number',
    default: 0,
    min: 0,
    max: 150,
    validator: async (s: number) => true,
  })
  valueNumber!: AddonNumberSetting

  @AddonSetting({
    name: 'Some string',
    description: 'This is some string',
    default: true,
    min: 0,
    max: 150,
    validator: async (s: boolean) => true,
  })
  valueBoolean!: AddonBooleanSetting

  @SetupMethod()
  async setup() {} // Might be async

  @BreakDownMethod()
  async breakdown() {} // Might be async

  @MethodSetting({
    targets: ['hello'],
    name: 'Hello target',
    description: 'To whom to say hello to!',
    default: 'world',
    min: 0,
    max: 150,
    validator: async (s: string) => true, // Optional - might be async
  })
  methodName!: MethodStringSetting

  @Method({
    name: 'Hello',
    description: 'This method just returns a friendly hello!',
  })
  async hello(
    addonConfig: AddonConfig<this>,
    methodConfig: MethodConfig<this>
  ) {
    // Access to the addon config
    const { valueString, valueSecret, valueNumber, valueBoolean } = addonConfig

    // Access to the targeted method config
    const { methodName } = methodConfig

    // ... write some beautiful code
    console.log('Addon config', addonConfig)
    console.log('Method config', methodConfig)
  }
}
