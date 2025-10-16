// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@sveltejs/kit" />

interface User {
 id: string;
 username: string;
 avatar: string | null;
 hasSeenWelcome?: boolean;
}

declare global {
 namespace App {
  // interface Error {}
  interface Locals {
   user?: User | null;
  }
  // interface PageData {}
  // interface PageState {}
  // interface Platform {}
 }
}

export {};

declare module '@fortawesome/pro-solid-svg-icons/index.es' {
 export * from '@fortawesome/pro-solid-svg-icons';
}

interface PageData {}
