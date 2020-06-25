export class StringUtility {

	static randomString(): string {
		return Math.random().toString(36).substring(2, 12);
	}

	static padLeft(val: number, digits: number): string {
		return val.toString().padStart(digits, '0');
	}

	static getUrlParts (url: string): string[] {
		let parts: string[] = ['', ''];
		if(url && url !== undefined) {
			let str: string = url.substr(0, 8);
			 
			//Clean url
			url = url.replace(/https:\/\//g, '');
			url = url.replace(/http:\/\//g, '');
			url = url.replace(/\//g, '');
			url = url.replace(/#/g, '');
			parts[1]= url;

			//Load protocol
			if(str.indexOf('https://') > -1) {
				parts[0] = 'https://';
			} else if(str.indexOf('http://') > -1) {
				parts[0] = 'http://';
			} else if(str.charAt(0) === '/') {
				parts[0] = '/';
			} else if(str.indexOf('#') > -1) {
				parts[0] = '#';
			}
		} 
		return parts;
	};
}