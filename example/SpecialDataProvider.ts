import { DataProvider } from 'react-native-data-provider';

type SpecialDataModel = {
	username?: string;
	password?: string;
}

type M = SpecialDataModel;

class SpecialDataProvider extends DataProvider<M> {
	get configKey(): string {
		return "SpecialDataProvider";
	}
	
	get autoSave(): boolean {
		return true;
	}
	
	get defaultData(): M {
		return {};
	}

	public static get Data(): M {
		return this.Shared.data;
	}

	private static _sharedInstance: SpecialDataProvider;
    public static get Shared(): SpecialDataProvider {
        if (SpecialDataProvider._sharedInstance == null) {
            SpecialDataProvider._sharedInstance = new SpecialDataProvider();
        }
        return SpecialDataProvider._sharedInstance;
    }
}

export default SpecialDataProvider;