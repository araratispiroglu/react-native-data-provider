import AsyncStorage from "@react-native-community/async-storage";

abstract class DataProvider<T> {
	abstract get configKey(): string;
	abstract get autoSave(): boolean;
	abstract get defaultData(): T;

	public get data(): Partial<T> {
		return this._data;
	}

	public set data(val: Partial<T>) {
		if (this.isLoaded) {
			this._data = val;

			if (this.autoSave) {
				this.save();
			}
		}
	}

	public get isLoaded(): boolean {
		return this._isLoaded;
	}

	private _data: Partial<T> = {};
	private _isLoaded: boolean = false;
	private _revokeProxy?: Function;

	private handleReload(resolve?: (data: any) => void, resultData?: string | null) {
		this._data = resultData ? JSON.parse(resultData) : this.defaultData;
		this.injectAutoSaveProxyIfEnabled();
		this._isLoaded = true;
		resolve && resolve(this._data);	
	}

	private injectAutoSaveProxyIfEnabled(): void {
		if (this.autoSave) {
			if (this._revokeProxy) {
				this._revokeProxy();
				this._data = {};
			}

			let { proxy, revoke } = Proxy.revocable(this._data, {
					set: (target, key: keyof T, value) => {
					target[key] = value;
					this.save();
					return true;
				}
			});
			this._data = proxy;
			this._revokeProxy = revoke;
		}
	}

	public reload(): Promise<Partial<T>> {
		return new Promise<Partial<T>>((resolve) => {
			const promise = AsyncStorage.getItem(this.configKey);
			promise.then(result => {
				this.handleReload(resolve, result);
			}).catch(() => {
				this.handleReload(resolve);
			});
		});
	}

	public save(): Promise<any> {
		if (!this._isLoaded || !this._data) {
			return Promise.reject();
		}
		
		const dataStr = JSON.stringify(this._data);
		return AsyncStorage.setItem(this.configKey, dataStr);
	}
	
	public saveByKey(value: Partial<T>): Promise<any> {
		if (!this._isLoaded) {
			return Promise.reject();
		}

		if (!this._data) {
			this._data = {};
		}
		this._data = {...this._data, ...value};
		if (this.autoSave) {
			return this.save();
		} else {
			return Promise.resolve(this.data);
		}
	}

	public erase(): Promise<any> {
		this.handleReload();
		return AsyncStorage.removeItem(this.configKey);
	}
}

export default DataProvider;
