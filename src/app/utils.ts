export class Utils {

    static debounce ( func: (...args: any[]) => void, wait: number, immediate: boolean ) {
		let timeout: null | ReturnType<typeof setTimeout> = null;
		return function () {
            const args = arguments;
			const later = function () {
				timeout = null;
				if ( !immediate ) {
					func(...args);
				}
			};
			const callNow = immediate && !timeout;
            if (timeout)
			    clearTimeout( timeout );
			timeout = setTimeout( later, wait );
			if ( callNow ) {
				func(...args);
			}
		};
	}
}
