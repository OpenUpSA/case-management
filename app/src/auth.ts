import { useHistory } from "react-router-dom";

import { IStorage } from "./types";

abstract class Storage<T extends string> {
  private readonly storage: IStorage;

  public constructor(getStorage = (): IStorage => window.localStorage) {
    this.storage = getStorage();
  }

  protected get(key: T): string | null {
    return this.storage.getItem(key);
  }

  protected set(key: T, value: string): void {
    this.storage.setItem(key, value);
  }

  protected clearItem(key: T): void {
    this.storage.removeItem(key);
  }

  protected clearItems(keys: T[]): void {
    keys.forEach((key) => this.clearItem(key));
  }
}

enum Locals {
  ACCESS_TOKEN = "access_token",
}

export class Tokens extends Storage<Locals> {
  private static instance?: Tokens;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Tokens();
    }

    return this.instance;
  }

  public getAccessToken() {
    return this.get(Locals.ACCESS_TOKEN);
  }

  public setAccessToken(accessToken: string) {
    this.set(Locals.ACCESS_TOKEN, accessToken);
  }

  public clear() {
    this.clearItems([Locals.ACCESS_TOKEN]);
  }
}

export const isLoggedIn = () => {
  const tokens = Tokens.getInstance();
  return tokens.getAccessToken() !== null;
};

export const RedirectIfLoggedIn = () => {
  let history = useHistory();
  if (isLoggedIn()) {
    history.push("/clients");
  }
};

export const RedirectIfNotLoggedIn = () => {
  let history = useHistory();
  if (!isLoggedIn()) {
    history.push("/login");
  }
};

