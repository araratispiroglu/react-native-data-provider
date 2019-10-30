import React, { Component } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	TextInput,
} from 'react-native';

import SpecialDataProvider from './SpecialDataProvider';

class App extends Component {
	componentDidMount() {
		SpecialDataProvider.Shared.reload();
	}
	
	render() {
		return (
			<>
				<StatusBar barStyle="dark-content" />
				<SafeAreaView>
					<ScrollView
						contentInsetAdjustmentBehavior="automatic">
						<TextInput></TextInput>
						<TextInput></TextInput>
					</ScrollView>
				</SafeAreaView>
			</>
		);
	}
}

const styles = StyleSheet.create({
	
});

export default App;
