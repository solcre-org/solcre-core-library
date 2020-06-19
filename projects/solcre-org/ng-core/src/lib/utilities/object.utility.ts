export class ObjectUtility {

	// Clone
	static clone(obj: any): any {
		// basic type deep copy
		if (obj === null || obj === undefined || typeof obj !== 'object' || obj instanceof File || obj instanceof Blob) {
			return obj
		}
		// array deep copy
		if (obj instanceof Array) {
			let cloneA = [];
			for (let i = 0; i < obj.length; ++i) {
				cloneA[i] = ObjectUtility.clone(obj[i]);
			}
			return cloneA;
		}
		// object deep copy
		var cloneO = {};
		for (let i in obj) {
			cloneO[i] = ObjectUtility.clone(obj[i]);
		}
		return cloneO;
	}
}