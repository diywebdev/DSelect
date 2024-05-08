const optionsParams = {
	data: [],
	search: false,
	placeholder: null,
}

export class DSelect {
	constructor(selector, options = optionsParams) {
		this.$el = document.querySelector(selector);
		this.options = { ...optionsParams, ...options };
		
		if(!this.$el){ console.error("DSELECT,",`Element ${selector} not found`); return; }
		if(!this.options.data.length && this.$el.tagName!== 'SELECT'){ console.error("DSELECT,",`The array data is empty or the element ${selector} is not a select tag`); return; }

		this.$dropdown = null;
		this.data = [];
		this.placeholder = this.options.placeholder;
		
		if(this.options.data.length){
			this.data = this.options.data;
		}else if(this.$el.tagName === 'SELECT'){
			let optArr = Array.prototype.slice.call(this.$el.querySelectorAll("option"));
			if(optArr[0].getAttribute('disabled') != null){
				this.placeholder = optArr[0].value || optArr[0].text;
			}
			optArr.shift();
			optArr.map((item, index) => {
				this.data.push({
					id: item.getAttribute('id') || index+1,
					value: item.getAttribute('value') || item.value,
					label: item.text
				})
			});
		}else{
			this.data = [];
		}
		console.log(this.data);
		this.#render()
		this.#setup()

	}

	#render(){
		this.$dropdown = document.createElement("div");
   	this.$dropdown.classList.add("d-dropdown");
		this.$dropdown.innerHTML = getTemplate(this.data, this.placeholder);
		if(this.$el.tagName === 'SELECT'){
			this.$el.insertAdjacentElement("afterend", this.$dropdown);
			this.$el.style.display = "none";
		}else{
			this.$el.insertAdjacentElement("afterbegin", this.$dropdown);
		}
	}

	#setup() {
		this.clickHandler = this.clickHandler.bind(this)
		this.$dropdown.addEventListener('click', this.clickHandler)
	 }

	clickHandler(event) {
		const {type} = event.target.dataset
		if(type === 'select'){
			this.toggle()
		}
	}

	get isOpen() {
		return this.$dropdown.classList.contains('open');
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open(){
		this.$dropdown.classList.add('open');
	}

	close(){
		this.$dropdown.classList.remove('open');
	}
}


function getTemplate(data, placeholder) {
	const items = data.map((item) => {
		const dataId = item.id ? `data-id="${item.id}"` : '';
		const dataValue = item.value ? `data-value="${item.value}"` : '';
		return `<div class="d-dropdown-menu-item" ${dataId} ${dataValue}>${item.label}</div>`
	});
	return `
		<div class="d-dropdown-select" data-type="select">
			<span data-type="select">${placeholder ?? `Default placeholder`}</span>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4" data-type="select"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
		</div>
		<div class="d-dropdown-menu">
			<input placeholder="Поиск..." type="text" class="d-dropdown-menu-search" style="display:none;" data-type="search">
			<div class="d-dropdown-menu-inner" data-type="item">
				${items.join('')}
			</div>
		</div>
	`;
}