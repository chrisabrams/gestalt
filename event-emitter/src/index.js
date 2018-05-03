class EE {

  constructor() {

  }

  emit(e) {
    this._events = this._events || {}

		if(e in this._events === false)	return

		for(let i = 0, l = this._events[e].length; i < l; i++) {
			this._events[e][i].apply(this, Array.prototype.slice.call(arguments, 1))
    }
    
    return this
  }

  off(e, f) {
    this._events = this._events || {}

		if(e in this._events === false)	return

    if(f) {
      this._events[e].splice(this._events[e].indexOf(f), 1)
    }
    else {
      delete this._events[e]
    }

    return this

  }

  on(e, f) {
    this._events    = this._events    || {}
		this._events[e] = this._events[e]	|| []
    this._events[e].push(f)
    
    return this
  }

  once(e, f) {
    const _this  = this

    this.on(e, function onOnce() {
      f.apply(this, arguments)
      _this.off.call(_this, e, f)
    })

    return this
  }

}

module.exports = EE
