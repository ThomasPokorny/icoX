function generateIdenticonImage(hash) {
		
	/* Configuration variables */
	const MAX_COLOR 			= 210;				// max  value for a r,g,b color component
	const MIN_COLOR 			= 60; 				// min value for a r,g,b color component
	const SQUARE 				= 50; 				// size of a square in pixels
	const GRID 					= 9; 				// mumber of squares width and height
	const SIZE 					= SQUARE * GRID ; 	// size of the canvas
	const MODULO_RANGE 			= 10;   			// when the range is 10, the fill chance is a little bit over 1/4 ( 12 => 1/4 ) 

	var XOR_GENERATOR 			= 0x52;				// initial value used to xor the hash   

	/* Generate a color from sha256 hash */
	function generateColorFromHash(sha256) {
		var sum = 0;

		for(var i = 0; i <sha256.length; i++){
			let temp = sha256.charCodeAt(i) ^ XOR_GENERATOR;
			XOR_GENERATOR = temp << 8;
			//  
			sum = (sum >> 8) + temp;
		}
		var generators = [];

		generators.push((sum %  16) / 16 * (MAX_COLOR - MIN_COLOR) + MIN_COLOR );
		sum = sum /16;
		generators.push((sum %  16) / 16 * (MAX_COLOR - MIN_COLOR) + MIN_COLOR );

		sum = sum /16;
		generators.push((sum %  16) / 16 * (MAX_COLOR - MIN_COLOR) + MIN_COLOR );

		var rgb = [ ];
		for (var i = 0; i < 3; i++) {
			var val = generators[i];
			var minEnforced = Math.max(MIN_COLOR, val);
			var maxEnforced = Math.min(MAX_COLOR, minEnforced);
			rgb.push(maxEnforced);
		}
		return rgb;
	};

	/* rotating the rgb color */ 
	function rotateColor(rgb){
		var rgbNuevo = [];
		rgbNuevo.push(rgb[2]);
		rgbNuevo.push(rgb[0]);
		rgbNuevo.push(rgb[1]);

		return rgbNuevo;
	}

	/* generates  lighter or darker variations of the base color by using  a character of the hash string*/
	function generateColorVariation(rgb ,char) {
		var rgbNuevo = [ ];

		var substract = Math.min(parseInt(char, 16) / 16 * 30 , 30);

		for (var i = 0; i < 3; i++) {
			rgbNuevo.push( rgb[i] - substract  ); 
		}
		return rgbNuevo;
	};

	/* create a block of the identicon */
	function fillBlock(x, y, color, context) {
		context.beginPath();
		context.rect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
		context.fillStyle = 'rgb(' + color.join(',') + ')';
		context.fill();
	}

	/* Generate a random identicon */
	function createeIdenticon() {

		/* creating the background */
		var canvas = document.createElement('canvas');
		canvas.width = SIZE;
		canvas.height = SIZE;

		var context = canvas.getContext('2d');
		var color = generateColorFromHash(hash); 

		var colorRotated = rotateColor(color);

		/* creating the background color squares */
		var index = 0; // the index is used to iterate through the sha256 string
		for (var x = 0; x < GRID; x++) {
			for (var y = 0; y < GRID; y++) {
				
				// sinze there can be more squres then the lenght of the hash, the index needs to be reset
				if(hash.length -1 == index)
					index = 0; 
				
				fillBlock(x, y, generateColorVariation(color, hash.charAt(index)), context);

				index++;
			}
		}

		/* creating the avatar image */
		index = 0;
		for (var x = 1; x < GRID -1 ; x++) {
			for (var y = 1; y < GRID -1 ; y++) {
				
				if(hash.length -1 == index)
					index = 0; 
				
				// calculating the fill chance 
				if(parseInt(hash.charAt(index), 16) % 16 >= MODULO_RANGE ){
					fillBlock(x, y, generateColorVariation(colorRotated, hash.charAt(index)) , context);
		
					//mirroring the block
					fillBlock(GRID - (x+1), y, generateColorVariation(colorRotated, hash.charAt(index)) , context);
				}

				index++;
			}
		}

		return canvas.toDataURL();
	}
	
	// return the icon as img
	let urlDataImage = createeIdenticon();		// Generate identicon
	let image = new Image;				// Create new image object
	image.src = urlDataImage;			// Assign url data to image

	return image;
}

/* generating the identicon and appending it the parent DOM element */ 
function icoX(input, parentId, isSha256){
	// getting parent element
	let parentElement;

	// check if parameters are passed
	if(parentId !== undefined)
		parentElement = document.getElementById(parentId);
	else{
		// if no dom id is passed, the id of the surrounding element gets used 
		let scriptElements = document.getElementsByTagName('script');
        parentElement = scriptElements[scriptElements.length - 1].parentNode;
	}

	if(input === undefined)
		input = 'icoX'; // deafult value if no input is given

	// it is also possible to pass already hashed vlaues
	if(isSha256 === undefined || !isSha256)
		input = sha256(input);

	let identicon = generateIdenticonImage(input);

	parentElement.appendChild(identicon);	
}

/* Code and Documentation by  https://github.com/geraintluff  */
function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};
