var Async = function(generator){
	if (!isGeneratorFunction(generator)) {
		throw new Error('A GeneratorFunction is required.');
	}
	
	this.generator = generator;
};

Async.prototype = {
	run:function(){
		if(typeof this.iterator === 'undefined' || this.iterator === null){
			this.iterator = this.generator(this);
			this.iterator.done = false;
            this.iterator.running = false;
		}
		
		if(typeof this.iterator.done !== 'undefined' && this.iterator.done){
			return this;
		}
        
        if(this.iterator.running){
            this.prevResults = arguments;
            process.nextTick(this._run_async.bind(this));
            return;
        }
        
        this.iterator.running = true;
		var result = this.iterator.next(arguments);
		this.iterator.done = result.done;
        this.iterator.running = false;
		if(this.iterator.done && (typeof this.continueWith !== 'undefined') && this.continueWith != null){
			this.continueWith.run();
		}
		
		return this;
	},
	bind: function(obj, args){
		var _args = [this];
		if(typeof args !== 'undefined' && typeof args.length !== 'undefined'){
			for(var i = 0; i < args.length; ++i){
				_args.push(args[i]);
			}
		}
		
		this.iterator = this.generator.apply(obj, _args);
		this.iterator.done = false;
		return this;
	},
	more: function(){},
	callback: function(){
		return this.run.bind(this);
	},
	then: function(async){
		var task = this;
		while((typeof task.continueWith !== 'undefined') && task.continueWith !== null){
			task = task.continueWith;
		}
		
		task.continueWith = async;
		return this;
	},
    _run_async:function(){
        var _args = [];
		if(typeof this.prevResults !== 'undefined' && typeof this.prevResults.length !== 'undefined'){
			for(var i = 0; i < this.prevResults.length; ++i){
				_args.push(this.prevResults[i]);
			}
		}
        this.run.apply(this, _args);
    }
};

module.exports = Async;

function isGeneratorFunction(v) {
	return v && v.constructor && v.constructor.name === 'GeneratorFunction';
}