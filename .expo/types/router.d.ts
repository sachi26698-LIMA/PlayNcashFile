/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/games` | `/(tabs)/leaderboard` | `/(tabs)/profile` | `/(tabs)/wallet` | `/_sitemap` | `/admin` | `/admin/` | `/games` | `/games/coin-flip` | `/games/lucky-spin` | `/games/quiz` | `/leaderboard` | `/profile` | `/vip` | `/wallet`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
