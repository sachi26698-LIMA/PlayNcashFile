/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/games` | `/(tabs)/profile` | `/(tabs)/wallet` | `/_sitemap` | `/games` | `/games/coin-flip` | `/games/lucky-spin` | `/games/quiz` | `/profile` | `/wallet`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
