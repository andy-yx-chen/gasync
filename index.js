var Async = function(generator){
	if (!isGeneratorFunction(generator)) {
		throw new Error('A GeneratorFunction is required.');
	}
	
	this.iterator = generator(this);
};

Async.prototype = {
	run:function(){
		if(typeof this.iterator === 'undefined' || this.iterator === null){
			console.log('no iterator.');
			return false;
		}
		
		if(this.iterator.done){
			console.log('it is done.');
			return false;
		}else{
			this.iterator.next(arguments);
			return true;
		}
	},
	more: function(){},
	callback: function(){
		return this.run.bind(this);
	}
};

module.exports = Async;

function isGeneratorFunction(v) {
	return v && v.constructor && v.constructor.name === 'GeneratorFunction';
}