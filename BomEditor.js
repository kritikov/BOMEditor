class BomEditor {

	// PROPERTIES

	#canvas;
	#language = "EN";
	#allowAlertMessages = true;
	#decimals = 2;
	#attachExpandingEvent = true;
	#numberFormat = "el-GR";


	#history = {
		array: [],
		maxRecords: 1000,
		pointer: -1,		// current record of the array
		oldHTML: "",
		reset: function () {
			this.pointer = -1;
			this.array = [];
		},
		storeOld: function () {
			this.oldHTML = this.parent.#canvas.innerHTML;
		},
		add: function (oldHTML) {
			var newHTML = this.parent.#canvas.innerHTML;

			// set pointer as the last record and clear the history after that
			if (this.pointer < this.maxRecords - 1) {
				this.pointer++;
				this.array.length = this.pointer;
			}
			// if the history reached its limit then remove the first row of the array
			else {
				this.array.shift();
				this.pointer = this.array.length;
			}

			// add the new value
			this.array.push({
				oldHTML: this.oldHTML,
				newHTML: newHTML
			})

			this.historyChanged();
		},
		undo: function () {
			if (this.pointer >= 0) {
				var cur = this.array[this.pointer];
				this.parent.#canvas.innerHTML = cur.oldHTML;
				this.pointer--;
			}
			this.historyChanged();
			//Editor.RefreshButtons();
			//Editor.RefreshFilters();
			//Director.ObjectChanged();
		},
		redo: function () {
			if (this.pointer < this.array.length - 1) {

				this.pointer++;
				var cur = this.array[this.pointer];

				this.parent.#canvas.innerHTML = cur.newHTML;
			}
			this.historyChanged();
			//Editor.RefreshButtons();
			//Editor.RefreshFilters();
			//Director.ObjectChanged();
		},
		historyChanged: function () {

			// Δημιουργία και εκπομπή ενός custom event με όνομα "historyChange"
			const event = new CustomEvent('be-historyChange', {
				detail: {
					undoEnabled: this.pointer >= 0 ? true : false,
					redoEnabled: this.pointer < this.array.length - 1 ? true : false,
				} 
			});
			this.parent.eventTarget.dispatchEvent(event); // Εκπομπή του event
		}

	}

	#resources = {
		// A B C D E F G H I J K L M N O P Q R S T U V W X Y Z

		addPart: { GR: "προσθήκη εξαρτήματος", EN: "add part" },
		addParent: { GR: "προσθήκη γονέα", EN: "add parent" },
		addRaw: { GR: "προσθήκη υλικού", EN: "add raw material" },
		BOMQuantity: { GR: "ποσότητα ΒΟΜ", EN: "ΒΟΜ quantity" },
		BOMQuantityShort: { GR: "ποσ. ΒΟΜ", EN: "ΒΟΜ quant." },
		BOMQuantityInfo: { GR: "Η ποσότητα που απαιτείται από αυτό το υλικό για να παραχθεί η ποσότητα ΒΟΜ του εξάρτηματος γονέα", EN: "The quantity required of this material to produce the BOM quantity of the parent component" },
		cancel: { GR: "ακύρωση", EN: "cancel" },
		createClone: { GR: "δημιουργία αντίγραφου", EN: "create clone" },
		code: { GR: "κωδικός", EN: "code" },
		compareScrapViewTitle: { GR: "κατασκευαστικές απαιτήσεις με φύρα ή χωρίς", EN: "construction requirements with or without scrap" },
		cloneOnRoot: { GR: "δεν μπορείτε να δημιουργήσετε αντίγραφο της ρίζας", EN: "you cannot create a copy of the root" },
		deletePart: { GR: "διαγραφή εξαρτήματος", EN: "delete part" },
		deleteTree: { GR: "διαγραφή δέντρου", EN: "delete tree" },
		description: { GR: "περιγραφή", EN: "description" },
		edit: { GR: "επεξεργασία", EN: "edit" },
		editPart: { GR: "επεξεργασία εξαρτήματος", EN: "edit part" },
		fieldCannotBeEmpty: { GR: "το πεδίο δεν μπορεί να είναι κενό", EN: "the value cannot be empty" },
		fieldIsNotNumeric: { GR: "το πεδίο δεν περιέχει αριθμό", EN: "the value is not numeric" },
		finalQuantity: { GR: "τελ. ποσότητα", EN: "final quantity" },
		finalQuantityPartInfo: { GR: "η ποσότητα που πρέπει να παραχθεί συμπεριλαμβάνοντας όλες τις φύρες", EN: "the quantity to be produced including the scrap of all components" },
		finalQuantityRawInfo: { GR: "η ποσότητα που πρέπει να χρησιμοποιηθεί συμπεριλαμβάνοντας όλες τις φύρες", EN: "the quantity to be produced including the scrap of all components" },
		finalQuantityPartWithoutScrapInfo: { GR: "η ποσότητα του εξαρτήματος που πρέπει να παραχθεί χωρίς να υπολογίζεται η δική του φύρα αλλά υπολογίζοντας την φύρα των γονέων του", EN: "the quantity of the component that must be produced without calculating its own cost but by calculating the cost of its parents" },
		finalQuantityPartWithoutAnyScrapInfo: { GR: "η ποσότητα του εξαρτήματος που πρέπει να παραχθεί χωρίς να υπολογίζεται η δική του φύρα ή των γονέων του", EN: "the quantity of the component that must be produced without counting its own scrap or that of its parents" },
		finalQuantityRawNoScrapNoScrapInfo: { GR: "η ποσότητα του υλικού που πρέπει να χρησιμοποιηθεί χωρίς να υπολογίζεται ούτε η δική του φύρα ούτε του εξαρτήματος που το χρησιμοποιεί", EN: "the quantity of material to be used without taking into account either its own scrap or the scrap of the component that uses it" },
		finalQuantityRawWithScrapNoScrapInfo: { GR: "η ποσότητα του υλικού που πρέπει να χρησιμοποιηθεί χωρίς να υπολογίζεται η δική του φύρα αλλά υπολογίζοντας την φύρα του εξαρτήματος που το χρησιμοποιεί", EN: "the quantity of material to be used without calculating its own scrap but by calculating the scrap of the component that uses it" },
		finalQuantityRawNoScrapWithScrapInfo: { GR: "η ποσότητα του υλικού που πρέπει να χρησιμοποιηθεί υπολογίζοντας την φύρα του αλλά χωρίς την φύρα του εξαρτήματος που το χρησιμοποιεί", EN: "the quantity of material to be used, calculating its scrap but without calculating the scrap of the component that uses it" },
		finalQuantityRawWithScrapWithScrapInfo: { GR: "η ποσότητα του υλικού που πρέπει να χρησιμοποιηθεί υπολογίζοντας την φύρα του αλλά και την φύρα του εξαρτήματος που το χρησιμοποιεί", EN: "the quantity of material to be used by calculating its scrap and the scrap of the component that uses it" },
		material: { GR: "υλικό", EN: "material" },
		materials: { GR: "υλικά", EN: "materials" },
		moveUp: { GR: "μετακίνηση πάνω", EN: "move up" },
		moveDown: { GR: "μετακίνηση κάτω", EN: "move down" },
		moveOnSelf: { GR: "δεν μπορείτε να μετακινήσετε ένα εξάρτημα στον εαυτό του", EN: "you cannot move a part onto itself" },
		moveOnChildren: { GR: "δεν μπορείτε να μετακινήσετε ένα εξάρτημα σε κάποιο από τα παιδιά μου, μόνο να το φτιάξετε αντίγραφο του", EN: "you cannot move a part to one of its childrens, only make a copy of it" },
		part: { GR: "εξάρτημα", EN: "part" },
		partsHorViewTitle: { GR: "οριζόντιο δέντρο με τα εξαρτήματα", EN: "horizontal tree with components" },
		quantity: { GR: "ποσότητα", EN: "quantity" },
		raw: { GR: "υλικό", EN: "raw" },
		return: { GR: "επιστροφή", EN: "return" },
		requirementsHorViewTitle: { GR: "κατασκευαστικές απαιτήσεις με βάση τις φύρες", EN: "construction requirements based on scrap" },
		requirementsTreeViewTitle: { GR: "κατασκευαστικές απαιτήσεις με βάση τις φύρες", EN: "construction requirements based on scrap" },
		requirementsVerViewTitle: { GR: "κατασκευαστικές απαιτήσεις ανά κωδικό εξαρτήματος με βάση τις φύρες", EN: "construction requirements per part code based on scrap" },
		requirementsPerCodeViewTitle: { GR: "κατασκευαστικές απαιτήσεις ανά κωδικό με βάση τις φύρες", EN: "construction requirements per code based on scrap" },
		requirementsPerRawViewTitle: { GR: "κατασκευαστικές απαιτήσεις ανά υλικό με φύρα ή χωρίς", EN: "construction requirements per material with or without scrap" },
		save: { GR: "αποθήκευση", EN: "save" },
		scrap: { GR: "φύρα", EN: "scrap" },
		scrapInfo: { GR: "Το ποσοστό του υλικού που καταστρέφεται κατά την παραγωγική διαδικασία. Αυτό το ποσοστό θα επηρεάσει την πραγματική ποσότητα των υλικών που χρειάζονται για να παραχθεί η δηλωθέν ποσότητα", EN: "The percentage of material that is destroyed during the production process. This percentage will affect the actual amount of materials needed to produce the declared quantity." },
		scrapOverflow: { GR: "η τιμή πρέπει να είναι τουλάχιστον 0 και μικρότερη από το 100", EN: "the value must be at least 0 and less than 100" },
		type: { GR: "τύπος", EN: "type" },
		withScrap: { GR: "με φύρα", EN: "with scrap" },
		withoutScrap: { GR: "χωρίς φύρα", EN: "without scrap" },
		withPartScrap: { GR: "με φύρα εξαρτημάτων", EN: "with scrap of the parts" },
		withoutPartScrap: { GR: "χωρίς φύρα εξαρτημάτων", EN: "without scrap of the parts" },
		unit: { GR: "μονάδα μέτρησης", EN: "unit" },
		unitInfo: { GR: "μονάδα μέτρησης", EN: "unit" },
		unitShort: { GR: "ΜΜ", EN: "MM" },
		uses: { GR: "χρήσεις", EN: "uses" },
		finalQuantityWithAllScraps: { GR: "η απαιτούμενη ποσότητα συμπεριλαμβάνοντας όλα τις φύρες (και των εξαρτημάτων και του υλικού)", EN: "the required quantity including all scraps (both parts and material)" },
	}


	///// CONSTRUCTOR

	constructor(options) {
		if (options.element) {
			let canvas = document.createElement("div");
			canvas.classList.add("be-canvas");
			options.element.appendChild(canvas);
			this.#canvas = canvas;
		}

		if (options.language)
			this.#language = options.language;

		if (options.allowAlertMessages)
			this.#allowAlertMessages = options.allowAlertMessages;
		
		if (options.decimals)
			this.#decimals = options.decimals;
		
		if (options.attachExpandingEvent)
			this.#attachExpandingEvent = options.attachExpandingEvent;

		if (options.numberFormat)
			this.#numberFormat = options.numberFormat;
		
		this.#history.parent = this;
		this.eventTarget = new EventTarget();

		let editor = this;

		// add event listener to canvas
		this.#canvas.addEventListener("click", this.#handleClick.bind(this));
		this.#canvas.addEventListener("dblclick", this.#handleDblClick.bind(this));

		// add general events on document body
		// using option of attaching the event in case of a second bom editor and avoiding duplication
		if (this.#attachExpandingEvent) {
			document.body.addEventListener("click", function (event) {

				// this event is for the views and expanding or not the materials of a part
				// cannot attach it to canvas
				if (event.target.classList.contains('be-expand-materials')) {
					event.stopPropagation();
					let part = event.target.closest(".be-part");
					let materials = part.querySelector(".be-part-materials");
					if (materials.classList.contains("be-hidden"))
						materials.classList.remove("be-hidden");
					else
						materials.classList.add("be-hidden");
				}
			});
		}

		// add events for drag and drop
		this.#canvas.addEventListener("dragstart", function (event) {

			if (event.target.classList.contains("be-part-header")) {
				editor.elementToDrop = event.target.closest(".be-part");
				event.dataTransfer.setData("text/html", editor.elementToDrop.outerHTML);
				event.dataTransfer.setData("type", "part");

				if (event.ctrlKey) {
					event.dataTransfer.dropEffect = "copy";
				}
				else {
					event.dataTransfer.dropEffect = "move";
				}

			}
			else if (event.target.classList.contains("be-material")) {
				editor.elementToDrop = event.target;
				event.dataTransfer.setData("text/html", event.target.outerHTML);
				event.dataTransfer.setData("type", "material");
			}
		});
		this.#canvas.addEventListener("dragenter", function (event) {
			if (event.target.closest(".be-part")) {
				event.preventDefault();
			}
		});
		this.#canvas.addEventListener("dragover", function (event) {
			if (event.target.closest(".be-part")) {
				event.preventDefault();
			}
		});
		this.#canvas.addEventListener("drop", function (event) {
			let part = event.target.closest(".be-part");
			let material = event.target.closest(".be-material");
			let partData = event.target.closest(".be-part-data");
			if (partData) {
				event.preventDefault();
				event.stopPropagation();
				editor.#history.storeOld();

				let data = event.dataTransfer.getData("text/html");
				let transferType = event.dataTransfer.getData("type");

				if (transferType == "part") {

					// check if we dont move the part on its self
					if (!event.ctrlKey && part === editor.elementToDrop) {
						editor.#alert(editor.#text("moveOnSelf"));
						return;
					}

					// check if we move the part into one of its childrens
					if (!event.ctrlKey && editor.elementToDrop.contains(part)) {
						editor.#alert(editor.#text("moveOnChildren"));
						return;
					}

					// remove old element if we move it
					if (editor.elementToDrop && !event.ctrlKey) {
						editor.elementToDrop.remove();
					}

					// create the new element as child to the target
					let elementTarget = event.target.closest(".be-part").querySelector(":scope > .be-parts");
					elementTarget.innerHTML += data;

				}
				else if (transferType == "material") {

					// check if we dont move the part on its self
					if (!event.ctrlKey && material === editor.elementToDrop) {
						return;
					}

					// remove old element
					if (editor.elementToDrop && !event.ctrlKey) {
						editor.elementToDrop.remove();
					}
					else {
						editor.#unselectMaterial(editor.elementToDrop);
					}

					// create the new element as child to the target
					var elementTarget = event.target.closest(".be-part").querySelector(":scope > .be-part-data").querySelector(".be-part-materials tbody");
					if (!elementTarget) {
						let tbody = document.createElement("tbody");
						let table = event.target.closest(".be-part").querySelector(":scope > .be-part-data").querySelector(".be-part-materials");
						table.appendChild(tbody);
						elementTarget = tbody;
					}
					elementTarget.innerHTML += data;
				}

				editor.#history.add();
			}
		});

	}


	////// CUSTOM EVENTS
	
	onHistoryChange(listener) {
		if (this.eventTarget)
			this.eventTarget.addEventListener('be-historyChange', listener);
	}


	///// PUBLIC METHODS

    draw(bom) {
		let html = `<div class='be-horView be-editor'>`;
		html += this.#partHTML(bom);
		html += `</div>`;

		this.#canvas.innerHTML = html;

		//Editor.RefreshButtons();
		//Editor.RefreshFilters();

	}

	// create a new bom
	newProduct() {
		let item = {
			code: "80000",
			description: "final product",
			quantity: 1,
			unit: "TM",
			type: 1,
			scrap: 0,
			items: [],
		}

		this.draw(item);
	}

	// clear the canvas
	clear() {
		this.#canvas.innerHTML = "";
	}

	// go back one move on editor
	undo() {
		this.#history.undo();
	}

	// go forward one move on editor
	redo() {
		this.#history.redo();
	}

	// get the project as json
	getBOMAsJson() {
		let bom = this.getBOM();
		return JSON.stringify(bom);
	}

	// get the project as object
	getBOM() {
		let editor = this;

		// get the first part
		let firstPart = this.#canvas.querySelector(".be-part")
		let project = getItemFromPart(firstPart);

		function getItemFromPart(part) {
			let item = editor.#getItemFromPart(part);

			// get materials
			let materials = part.querySelector(":scope > .be-part-data").querySelector(":scope > .be-part-materials").querySelectorAll(".be-material");
			for (let material of materials) {
				let materialItem = editor.#getItemFromMaterial(material);
				item.items.push(materialItem);
			}

			// get parts
			let childrenParts = part.querySelector(":scope > .be-parts").querySelectorAll(":scope > .be-part");
			for (let childrenPart of childrenParts) {
				let childrenPartMaterial = getItemFromPart(childrenPart);
				item.items.push(childrenPartMaterial);
			}

			return item;
		}

		return project;
	}

	// draw a view in an element
	drawView(options) {
		options.bom = this.getBOM();
		options.displayTitle = true;

		if (!options.minimized)
			options.minimized = false;

		let html = "";
		if (options.view == "partsHorView") {
			html = this.#partsHorViewHTML(options);
		}
		else if (options.view == "requirementsHorView") {
			html = this.#requirementsHorViewHTML(options);
		}
		else if (options.view == "compareScrapView") {
			html = this.#compareScrapViewHTML(options);
		}
		else if (options.view == "requirementsPerCodeView") {
			html = this.#requirementsPerCodeViewHTML(options);
		}
		else if (options.view == "requirementsPerRawView") {
			html = this.#requirementsPerRawViewHTML(options);
		}
		else if (options.view == "requirementsVerView") {
			html = this.#requirementsVerViewHTML(options);
		}
		else if (options.view == "requirementsTreeView") {
			html = this.#requirementsTreeViewHTML(options);
		}
		options.element.innerHTML = html;
	}


	///// PRIVATE METHODS

	// Η μέθοδος που καλείται όταν κάνουμε κλικ στο canvas
	#handleClick(event) {

		// Έλεγχος αν το κλικ έγινε για να ανοίξει το μενού των parts
		if (event.target.classList.contains('be-toggleMenu')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#toggleMenu(part);
		}
		// if the click was from the delete material button
		else if (event.target.classList.contains('be-materialRemove')) {
			let material = event.target.closest(".be-material");
			event.stopPropagation();
			this.#deleteMaterial(material);
		}
		// if click is on a material (this event must be in specific order)
		else if (event.target.closest(".be-material")) {
			let material = event.target.closest(".be-material");
			event.stopPropagation();
			this.#selectMaterial(material);
		}
		// if the click was from the part menu: edit part header
		else if (event.target.classList.contains('be-part-menu-editPartHeader')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#editPartHeader(part);
		}
		// if the click was from the part menu: add part after
		else if (event.target.classList.contains('be-part-menu-addPartHeader')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#addPartAfter(part);
		}
		// if the click was from the part menu: add part before
		else if (event.target.classList.contains('be-part-menu-addPartBefore')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#addPartBefore(part);
		}
		// if the click was from the part menu: add part before
		else if (event.target.classList.contains('be-part-menu-addRaw')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#addRaw(part);
		}
		// if the click was from the part menu: edit part header save button
		else if (event.target.classList.contains('be-dialog-itemEditor-save')) {
			event.stopPropagation();
			this.#itemEditorDialogSave();
		}
		// if the click was from the part menu: edit part header cancel button
		else if (event.target.classList.contains('be-dialog-itemEditor-cancel')) {
			event.stopPropagation();
			this.#itemEditorDialogClose();
		}
		// if the click was from the part menu: create part clone
		else if (event.target.classList.contains('be-part-menu-createPartClone')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");

			// if is the root part then dont allow the clone
			let parentParts = part.closest(".be-parts");
			if (!parentParts) {
				this.#alert(this.#text("cloneOnRoot"));
				return;
			}

			this.#createPartClone(part);
		}
		// if the click was from the part menu: move up
		else if (event.target.classList.contains('be-part-menu-movePartUp')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#movePartUp(part);
		}
		// if the click was from the part menu: move up
		else if (event.target.classList.contains('be-part-menu-movePartDown')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#movePartDown(part);
		}
		// if the click was from the part menu: delete part
		else if (event.target.classList.contains('be-part-menu-deletePart')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#deletePart(part);
		}
		// if the click was from the part menu: delete tree
		else if (event.target.classList.contains('be-part-menu-deleteTree')) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#deleteTree(part);
		}
		
		
	}

	// Η μέθοδος που καλείται όταν κάνουμε διπλό κλικ στο canvas
	#handleDblClick(event) {

		// Έλεγχος αν το κλικ έγινε για επεξεργασία κάποιου υλικού
		if (event.target.closest(".be-material")) {
			event.stopPropagation();
			let raw = event.target.closest(".be-material");
			let part = event.target.closest(".be-part");
			this.#editMaterial(part, raw);
		}
		else if (event.target.classList.contains("be-openPartEditor")) {
			event.stopPropagation();
			let part = event.target.closest(".be-part");
			this.#editPartHeader(part);
		}
	}

	// get the translated text of a word
	#text(key) {
		return this.#resources[key][this.#language];
	}

	// display a warning message
	#alert(message) {
		if (this.#allowAlertMessages)
			alert(message);
	}

	// hide / unhide the menu of a part
	#toggleMenu(part) {
		let menu = part.querySelector(".be-part-menu");

		// if the menu doesnt exist...
		if (!menu) {

			// ...remove all open part menus
			this.#removePartMenus();

			// ...display the part menu
			let html = this.#partMenuHTML();
			let partData = part.querySelector(".be-part-data");
			partData.innerHTML += html;
		}
		// ...else remove it
		else {
			menu.remove();
		}
	}

	// remove all part menus
	#removePartMenus() {
		let menus = this.#canvas.querySelectorAll(".be-part-menu");
		for (const menu of menus) {
			menu.remove();
		}
	}

	// hide the menu of a part
	#removePartMenu(part) {
		let menu = part.querySelector(".be-part-menu");
		if (menu)
			menu.remove();
	}

	// edit the fields of a part header
	#editPartHeader(part) {
		this.#removePartMenu(part);
		let item = this.#getItemFromPart(part);
		let html = this.#itemEditorDialogHTML(item, "edit");
		part.innerHTML += html;
		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		dialog.showModal();
	}

	// display the dialog to add a new part as children of the current part
	#addPartAfter(part) {
		this.#removePartMenu(part);
		let item = {
			code: "",
			description: "",
			type: 1,
			quantity: "",
			unit: "",
			scrap: "",
		}
		let html = this.#itemEditorDialogHTML(item, "add");
		part.innerHTML += html;
		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		dialog.showModal();
	}

	// display the dialog to add a new part as parent of the current part
	#addPartBefore(part) {
		this.#removePartMenu(part);
		let item = {
			code: "",
			description: "",
			type: 1,
			quantity: "",
			unit: "",
			scrap: "",
		}
		let html = this.#itemEditorDialogHTML(item, "addBefore");
		part.innerHTML += html;
		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		dialog.showModal();
	}

	// display the dialog to add a new material to a part
	#addRaw(part) {
		this.#removePartMenu(part);
		let item = {
			code: "",
			description: "",
			type: 2,
			quantity: "",
			unit: "",
			scrap: "",
		}
		let html = this.#itemEditorDialogHTML(item, "add");
		part.innerHTML += html;
		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		dialog.showModal();
	}

	// display the dialog to edit a material of a part
	#editMaterial(part, material) {
		this.#removePartMenu(part);

		let item = this.#getItemFromMaterial(material);
		let html = this.#itemEditorDialogHTML(item, "edit");
		part.innerHTML += html;
		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		dialog.showModal();
	}

	// get the item from a raw
	#getItemFromMaterial(material) {
		let item = {
			code: material.querySelector(".be-code").innerHTML,
			description: material.querySelector(".be-description").innerHTML,
			type: Number(material.dataset.type),
			quantity: Number(material.querySelector(".be-quantity").innerHTML),
			unit: material.querySelector(".be-unit").innerHTML,
			scrap: Number(material.dataset.scrap),
			items: []
		}

		return item;
	}

	// get the item from a part
	#getItemFromPart(part) {
		let item = {
			code: part.querySelector(".be-part-header .be-code").innerHTML,
			description: part.querySelector(".be-part-header .be-description").innerHTML,
			type: Number(part.querySelector(".be-part-header").dataset.type),
			quantity: Number(part.querySelector(".be-part-header .be-quantity").innerHTML),
			unit: part.querySelector(".be-part-header .be-unit").innerHTML,
			scrap: Number(part.querySelector(".be-part-header .be-scrap").innerHTML),
			items: []
		}

		return item;
	}

	// get the part of an element
	#getPart(element) {
		let part = element.closest(".be-part");
		return part;
	}

	// create a copy of a part and place it after it
	#createPartClone(part) {
		this.#removePartMenu(part);
		this.#history.storeOld();

		let clone = part.cloneNode(true);
		part.after(clone);

		this.#history.add();
	}

	// move a part one location up
	#movePartUp(part) {
		this.#removePartMenu(part);
		this.#history.storeOld();

		let previousPart = part.previousElementSibling;
		if (previousPart) {
			previousPart.before(part);
		}

		this.#history.add();
	}

	// move a part one location down
	#movePartDown(part) {
		this.#removePartMenu(part);
		this.#history.storeOld();

		let nextPart = part.nextElementSibling;
		if (nextPart) {
			nextPart.after(part);
		}

		this.#history.add();
	}

	// add a part as children of another part
	#addChildren(part, item) {
		this.#history.storeOld();

		let newPartHTML = this.#partHTML(item);
		part.querySelector(":scope > .be-parts").innerHTML += newPartHTML;

		this.#history.add();
	}

	// delete a part and connect its childrens with its parent
	#deletePart(part) {
		this.#removePartMenu(part);
		this.#history.storeOld();

		let childrenParts = part.querySelector(".be-parts").querySelectorAll(":scope > .be-part");
		for (const childrenPart of childrenParts) {
			part.before(childrenPart);
		}
		part.remove();

		this.#history.add();
	}

	// delete a part and all of its childrens
	#deleteTree(part) {
		this.#removePartMenu(part);
		this.#history.storeOld();

		part.remove();

		this.#history.add();
	}

	// unselect a material
	#unselectMaterial(material) {
		material.classList.remove("be-selected");
	}

	// unselect all materials
	#unselectMaterials() {
		let Raws = this.#canvas.querySelectorAll(".be-material");
		for (let Raw of Raws)
			Raw.classList.remove("be-selected");
	}

	// unselect all materials of a part
	#unselectPartMaterials(part) {
		let materials = part.querySelector(".be-part-materials").querySelectorAll("tr");
		for (let material of materials)
			material.classList.remove("be-selected");
	}

	// select a material
	#selectMaterial(material) {
		this.#unselectMaterials();
		material.classList.add("be-selected");
	}

	// delete a material
	#deleteMaterial(material) {
		this.#history.storeOld();

		material.remove();

		this.#history.add();
	}

	// display a number with decimals
	#displayNumber(value, decimals) {
		//value = value.toFixed(decimals);
		if (!decimals)
			decimals = this.#decimals;
		value = value.toLocaleString(this.#numberFormat, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
		return value;
	}

	// create the part html
	#partHTML(item) {
		let html = "";
		let editor = this;

		html += `<div class='be-part'>${this.#partDataHTML(item)}`;
		html += `	<div class='be-parts'>`;
		item.items.forEach(function (BOMitem) {
			if (BOMitem.type == 1) {
				html += editor.#partHTML(BOMitem);
			}
		});
		html += `	</div>`;
		html += `</div>`;

		return html;
	}

	// create the part data html
	#partDataHTML(part) {
		let html = "";
		let editor = this;

		html += `<div class='be-part-data'>`;
		html += `	<table class='be-part-header' data-type='${part.type}' draggable='true'>`;
		html += `		<tr>`;
		html += `			<td class='be-code be-openPartEditor' colspan='4'>${part.code}</td>`;
		html += `			<td class='be-button be-toggleMenu'>...</td>`;
		html += `		</tr>`;
		html += `		<tr>`;
		html += `			<td class='be-description' colspan='5'>${part.description}</td>`;
		html += `		</tr>`;
		html += `		<tr>`;
		html += `			<td class='be-label' title='${this.#text("BOMQuantityInfo")}'>${this.#text("quantity")}</td>`;
		html += `			<td class='be-quantity' title='${this.#text("BOMQuantityInfo")}'>${part.quantity}</td>`;
		html += `			<td class='be-unit' title='${this.#text("unit")}'>${part.unit}</td>`;
		html += `			<td class='be-label' title='${this.#text("scrapInfo")}'>${editor.#text("scrap")} %</td>`;
		html += `			<td class='be-scrap' title='${this.#text("scrapInfo")}'>${part.scrap}</td>`;
		html += `		</tr>`;
		html += `	</table>`;
		html += `	<table class='be-part-materials'>`;
		part.items.forEach(function (BOMitem) {
			if (BOMitem.type != 1) {
				html += editor.#materialHTML(BOMitem);
			}
		});
		html += `	</table>`;
		html += `</div>`;
		return html;
	}

	// create the raw item html
	#materialHTML(item) {
		let html = "", classes = "";

		if (item) {

			if (item.type == 2) {
				classes += "be-material be-raw ";
			}
			else if (item.type == 3) {
				classes += "be-material be-return ";
			}

			html += `<tr class='${classes}' data-type="${item.type}" data-scrap="${item.scrap}" draggable='true'>`;
			html += `	<td class='be-button be-materialRemove'>-</td>`;
			html += `	<td class='be-code be-label'>${item.code}</td>`;
			html += `	<td class='be-description'>${item.description}</td>`;
			html += `	<td class='be-quantity'>${item.quantity}</td>`;
			html += `	<td class='be-unit'>${item.unit}</td>`;
			html += `</tr>`;
		}

		return html;
	}

	// create the menu of a part
	#partMenuHTML() {
		let html = "";

		html += `<ul class='be-part-menu be-unselectable'>`;
		html += `	<li class="be-part-menu-addPartHeader">${this.#text("addPart")}</li>`;
		html += `	<li class="be-part-menu-editPartHeader">${this.#text("editPart")}</li>`;
		html += `	<li class="be-part-menu-addPartBefore">${this.#text("addParent")}</li>`;
		html += `	<li class="be-part-menu-addRaw">${this.#text("addRaw")}</li>`;
		html += `	<li class="be-part-menu-createPartClone">${this.#text("createClone")}</li>`;
		html += `	<li class="be-part-menu-movePartUp">${this.#text("moveUp")}</li>`;
		html += `	<li class="be-part-menu-movePartDown">${this.#text("moveDown")}</li>`;
		html += `	<li class="be-part-menu-deletePart">${this.#text("deletePart")}</li>`;
		html += `	<li class="be-part-menu-deleteTree">${this.#text("deleteTree")}</li>`;
		html += "</ul>";

		return html;
	}

	// create the dialog for editing the fields of a item
	#itemEditorDialogHTML(item, mode) {
		let html = "";

		html += `<dialog class="be-dialog-itemEditor" class="be-dialog" data-mode="${mode}">`;
		html += `	<p class="be-dialog-itemEditor-title">${this.#text("edit")}</p>`;
		html += `	<table>`;
		html += `		<tr>`;
		html += `			<td>${this.#text("code")}</td>`;
		html += `			<td><input class="be-code" size="20" value="${item.code}"></td>`;
		html += `		</tr>`;
		html += `		<tr>`;
		html += `			<td>${this.#text("description")}</td>`;
		html += `			<td><input class="be-description" size="30" value="${item.description}"></td>`;
		html += `		</tr>`;
		html += `		<tr>`;
		html += `			<td>${this.#text("type")}</td>`;
		html += `			<td>`;
		html += `				<select class="be-type">`
		if (item.type == 1) {
			html += `<option value="1" selected>${this.#text("part")}</option>`;
		}
		else {
			html += item.type == 2 ? `<option value="2" selected>${this.#text("raw")}</option>` : `<option value="2">${this.#text("raw")}</option>`;
			html += item.type == 3 ? `<option value="3" selected>${this.#text("return")}</option>` : `<option value="3">${this.#text("return")}</option>`;
		}
		html += `				</select>`
		html += `			</td>`
		html += `		</tr>`;
		html += `		<tr title='${this.#text("BOMQuantityInfo")}'>`;
		html += `			<td>${this.#text("quantity")}</td>`;
		html += `			<td><input class="be-quantity" size="10" value="${item.quantity}"></td>`;
		html += `		</tr>`;
		html += `		<tr>`;
		html += `			<td>${this.#text("unit")}</td>`;
		html += `			<td><input class="be-unit" size="3" value="${item.unit}"></td>`;
		html += `		</tr>`;
		html += `		<tr title='${this.#text("scrapInfo")}'>`;
		html += `			<td>${this.#text("scrap")} %</td>`;
		html += `			<td><input class="be-scrap" size="10" value="${item.scrap}"></td>`;
		html += `		</tr>`;
		html += "	</table>";
		html += `	<div class="be-dialog-itemEditor-message"></div>`;
		html += `	<div class="be-dialog-itemEditor-tools">`;
		html += `		<button class="be-dialog-itemEditor-save">${this.#text("save")}</button>`;
		html += `		<button class="be-dialog-itemEditor-cancel">${this.#text("cancel")}</button>`;
		html += `	</div>`;
		html += "</dialog>";

		return html;
	}

	// close the dialog for editing the fields of a item
	#itemEditorDialogClose() {
		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		dialog.remove();
	}

	// validate the values of an item
	#itemEditorDialogValidate() {
		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		let messageArea = dialog.querySelector(".be-dialog-itemEditor-message");
		let valid = true;
		messageArea.innerHTML = "";

		let code = dialog.querySelector(".be-code");
		code.classList.remove("be-error");
		// code cannot be empty
		if (!code.value) {
			code.classList.add("be-error");
			messageArea.innerHTML = `${this.#text("code")}: ${this.#text("fieldCannotBeEmpty")}`;
			valid = false;
		}

		let description = dialog.querySelector(".be-description");
		description.classList.remove("be-error");
		// description cannot be empty
		if (!description.value) {
			description.classList.add("be-error");
			messageArea.innerHTML = `${this.#text("description")}: ${this.#text("fieldCannotBeEmpty")}`;
			valid = false;
		}

		let quantity = dialog.querySelector(".be-quantity");
		quantity.classList.remove("be-error");
		// quantity cannot be empty
		if (!quantity.value) {
			quantity.classList.add("be-error");
			messageArea.innerHTML = `${this.#text("quantity")}: ${this.#text("fieldCannotBeEmpty")}`;
			valid = false;
		}
		else {
			// quantity must be a number
			let number = parseFloat(quantity.value);
			if (isNaN(number)) {
				quantity.classList.add("be-error");
				messageArea.innerHTML = `${this.#text("quantity")}: ${this.#text("fieldIsNotNumeric")}`;
				valid = false;
			}
		}

		let unit = dialog.querySelector(".be-unit");
		unit.classList.remove("be-error");
		// scrap cannot be empty
		if (!unit.value) {
			unit.classList.add("be-error");
			messageArea.innerHTML = `${this.#text("unit")}: ${this.#text("fieldCannotBeEmpty")}`;
			valid = false;
		}

		let scrap = dialog.querySelector(".be-scrap");
		scrap.classList.remove("be-error");
		// scrap cannot be empty
		if (!scrap.value) {
			scrap.classList.add("be-error");
			messageArea.innerHTML = `${this.#text("scrap")}: ${this.#text("fieldCannotBeEmpty")}`;
			valid = false;
		}
		else {
			// scrap must be a number
			let number = parseFloat(scrap.value);
			if (isNaN(number)) {
				scrap.classList.add("be-error");
				messageArea.innerHTML = `${this.#text("scrap")}: ${this.#text("fieldIsNotNumeric")}`;
				valid = false;
			}

			// scrap must be at least 0 and less than 100
			if (!(number >= 0 && number < 100)) {
				scrap.classList.add("be-error");
				messageArea.innerHTML = `${this.#text("scrap")}: ${this.#text("scrapOverflow")}`;
				valid = false;
			}
		}

		return valid;
	}

	// save the item from the editor
	#itemEditorDialogSave() {

		// validate the item
		if (!this.#itemEditorDialogValidate())
			return;

		let dialog = this.#canvas.querySelector(".be-dialog-itemEditor");
		let mode = dialog.dataset.mode;
		let part = dialog.closest(".be-part");
		let item = {
			code: dialog.querySelector(".be-code").value,
			description: dialog.querySelector(".be-description").value,
			type: dialog.querySelector(".be-type").value,
			quantity: parseFloat(dialog.querySelector(".be-quantity").value),
			unit: dialog.querySelector(".be-unit").value,
			scrap: parseFloat(dialog.querySelector(".be-scrap").value),
			items: []
		}

		if (item.type == "1") {
			if (mode == "edit") {
				this.#history.storeOld();

				part.querySelector(".be-part-header .be-code").innerHTML = item.code;
				part.querySelector(".be-part-header .be-description").innerHTML = item.description;
				part.querySelector(".be-part-header").dataset.type = item.type;
				part.querySelector(".be-part-header .be-quantity").innerHTML = item.quantity;
				part.querySelector(".be-part-header .be-unit").innerHTML = item.unit;
				part.querySelector(".be-part-header .be-scrap").innerHTML = item.scrap;

				this.#history.add();
			}
			else if (mode == "add") {
				this.#addChildren(part, item);

				//this.#history.storeOld();

				//let newParentHTML = this.#getParentHTML({
				//	code: code,
				//	description: description,
				//	quantity: quantity,
				//	unit: unit,
				//	scrap: scrap,
				//	type: type,
				//	items: []
				//});

				//this.#getParent(part).querySelector(":scope > .be-parts").innerHTML += newParentHTML;

				//this.#history.add();
			}
			else if (mode == "addBefore") {
				this.#history.storeOld();

				let newParentHTML = this.#partHTML(item);

				let curParent = this.#getPart(part);
				curParent.insertAdjacentHTML("beforebegin", newParentHTML);

				let newParent = curParent.previousSibling;
				newParent.querySelector(":scope > .be-parts").appendChild(curParent);

				this.#history.add();
			}
		}
		else {
			if (mode == "edit") {
				this.#history.storeOld();

				let raw = part.querySelector("tr.be-selected");
				if (raw) {
					raw.querySelector(".be-code").innerHTML = item.code;
					raw.querySelector(".be-description").innerHTML = item.description;
					raw.dataset.type = item.type;
					raw.querySelector(".be-quantity").innerHTML = item.quantity;
					raw.querySelector(".be-unit").innerHTML = item.unit;
					raw.dataset.scrap = item.scrap;
				}

				this.#history.add();
			}
			else if (mode == "add") {
				this.#history.storeOld();

				let rawHTML = this.#materialHTML(item);
				part.querySelector(".be-part-materials").innerHTML += rawHTML;

				this.#history.add();
			}
		}

		dialog.remove();
	}


	///// VIEWS

	#partsHorViewHTML(options) {
		let html = "<div class='be-view'>";

		if (options.displayTitle) {
			html += `	<div class='be-view-title'>${this.#text("partsHorViewTitle")}</div>`;
		}

		html += `	<div class='be-horView be-partsHorView'>`;
		html += partHTML(options.bom);
		html += `	</div>`;
		html += `</div>`;

		return html;

		function partHTML(item) {
			let html = "";

			html += `<div class='be-part'>${partDataHTML(item)}`;
			html += `	<div class='be-parts'>`;
			item.items.forEach(function (BOMitem) {
				if (BOMitem.type == 1) {
					html += partHTML(BOMitem);
				}
			});
			html += `	</div>`;
			html += `</div>`;

			return html;
		}

		function partDataHTML(part) {
			let html = "";

			html += `<div class='be-part-data'>`;
			html += `	<div class='be-code'>${part.code}</div>`;
			html += `	<div class='be-description'>${part.description}</div>`;
			html += `</div>`;

			return html;
		}
	}

	#requirementsHorViewHTML(options) {
		let html = "<div class='be-view'>";
		let editor = this;

		if (options.displayTitle) {
			html += `	<div class='be-view-title'>${this.#text("requirementsHorViewTitle")}</div>`;
		}

		html += `	<div class='be-horView be-requirementsHorView'>`;
		html += partHTML(options.bom, options.bom.quantity, options.targetQuantity);
		html += `	</div>`;
		html += `</div>`;

		return html;

		function partHTML(part, parentBOMQuantity, parentFinalQuantity) {
			let html = "";

			if (part.type == 1) {
				part.finalQuantity = parentFinalQuantity / parentBOMQuantity * part.quantity * (1 + part.scrap / 100);;

				html += `<div class='be-part'>${partDataHTML(part)}`;
				html += `	<div class='be-parts'>`;
				part.items.forEach(function (BOMitem) {
					if (BOMitem.type == 1) {
						html += partHTML(BOMitem, part.quantity, part.finalQuantity);
					}
				});
				html += `	</div>`;
				html += `</div>`;
			}

			return html;
		}

		function partDataHTML(part) {
			let html = "";

			html += `<div class='be-part-data'>`;
			html += `	<table class='be-part-header'>`;
			html += `		<tr>`;
			html += `			<td class='be-part-header-code' colspan='7'>${part.code}</td>`;
			html += `		</tr>`;
			html += `		<tr>`;
			html += `			<td class='be-part-header-description' colspan='7'>${part.description}</td>`;
			html += `		</tr>`;
			html += `		<tr>`;
			html += `			<td class='be-label' title='${editor.#text("BOMQuantityInfo")}'>${editor.#text("BOMQuantityShort")}</td>`;
			html += `			<td class='be-quantity' title='${editor.#text("BOMQuantityInfo")}'>${editor.#displayNumber(part.quantity)}</td>`;
			html += `			<td class='be-label' title='${editor.#text("scrapInfo")}'>${editor.#text("scrap")} %</td>`;
			html += `			<td class='be-scrap' title='${editor.#text("scrapInfo")}'>${editor.#displayNumber(part.scrap)}</td>`;
			html += `			<td class='be-label' title='${editor.#text("finalQuantityPartInfo")}'>${editor.#text("quantity")}</td>`;
			html += `			<td class='be-finalQuantity' title='${editor.#text("finalQuantityPartInfo")}'>${editor.#displayNumber(part.finalQuantity)}</td>`;
			html += `			<td class='be-unit'>${editor.#text("unitShort")}</td>`;
			html += `		</tr>`;
			html += `	</table>`;

			let materials = part.items.filter(x=>x.type != 1);
			if (materials.length > 1) {
				html += `	<table class='be-part-materials'>`;
				html += `		<tr>`;
				html += `			<td class='be-part-materials-title' colspan='5'>${editor.#text("materials")}</td>`;
				html += `		</tr>`;
				html += `		<tr>`;
				html += `			<td class='be-label'>${editor.#text("code")}</td>`;
				html += `			<td class='be-label'>${editor.#text("description")}</td>`;
				html += `			<td class='be-label' title='${editor.#text("scrapInfo")}'>${editor.#text("scrap")} %</td>`;
				html += `			<td class='be-label' title='${editor.#text("finalQuantityRawInfo")}'>${editor.#text("quantity")}</td>`;
				html += `			<td class='be-label'>${editor.#text("unitShort")}</td>`;
				html += `		</tr>`;

				part.items.forEach(function (BOMitem) {
					if (BOMitem.type != 1) {
						let finalQuantity = part.finalQuantity / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);

						let typeClass = "";
						if (BOMitem.type == 2) {
							typeClass = "be-raw";
						}
						else if (BOMitem.type == 3) {
							typeClass = "be-return ";
						}

						html += `<tr class='be-material ${typeClass}'>`;
						html += `	<td class='be-code be-label'>${BOMitem.code}</td>`;
						html += `	<td class='be-description'>${BOMitem.description}</td>`;
						html += `	<td class='be-scrap' title='${editor.#text("scrapInfo")}'>${editor.#displayNumber(BOMitem.scrap)}</td>`;
						html += `	<td class='be-finalQuantity' title='${editor.#text("finalQuantityRawInfo")}'>${editor.#displayNumber(finalQuantity)}</td>`;
						html += `	<td class='be-unit'>${BOMitem.unit}</td>`;
						html += `</tr>`;
					}
				});
				html += `	</table>`;

			}

			html += `</div>`;

			return html;

		}
	}

	#compareScrapViewHTML(options) {
		let html = "<div class='be-view'>";
		let editor = this;
		let analogy = options.targetQuantity / options.bom.quantity;

		if (options.displayTitle) {
			html += `	<div class='be-view-title'>${this.#text("compareScrapViewTitle")}</div>`;
		}

		html += `	<div class='be-horView be-compareScrapView'>`;
		html += partHTML(options.bom, options.bom.quantity, options.targetQuantity);
		html += `	</div>`;
		html += `</div>`;

		return html;

		function partHTML(part, parentBOMQuantity, parentFinalQuantityWithScrap) {
			let html = "";

			if (part.type == 1) {
				part.finalQuantityWithScrap = parentFinalQuantityWithScrap / parentBOMQuantity * part.quantity * (1 + part.scrap / 100);;
				part.finalQuantityNoScrap = analogy * part.quantity;

				html += `<div class='be-part'>${partDataHTML(part)}`;
				html += `	<div class='be-parts'>`;
				part.items.forEach(function (BOMitem) {
					if (BOMitem.type == 1) {
						html += partHTML(BOMitem, part.quantity, part.finalQuantityWithScrap);
					}
				});
				html += `	</div>`;
				html += `</div>`;
			}

			return html;
		}

		function partDataHTML(part) {
			let html = "";

			html += `<div class='be-part-data'>`;
			html += `	<table class='be-part-header'>`;
			html += `		<tr>`;
			html += `			<td class='be-part-header-code' colspan='8'>${part.code}</td>`;
			html += `		</tr>`;
			html += `		<tr>`;
			html += `			<td class='be-part-header-description' colspan='8'>${part.description}</td>`;
			html += `		</tr>`;
			html += `		<tr>`;
			html += `			<td class='be-label' colspan='2' title='${editor.#text("BOMQuantityInfo")}'>${editor.#text("BOMQuantityShort")}</td>`;
			html += `			<td class='be-label'>${editor.#text("unitShort")}</td>`;
			html += `			<td class='be-label' title='${editor.#text("scrapInfo")}'>${editor.#text("scrap")} %</td>`;
			html += `			<td class='be-label' colspan='2' title='${editor.#text("finalQuantityPartWithoutAnyScrapInfo")}'>${editor.#text("withoutScrap")}</td>`;
			html += `			<td class='be-label' colspan='2' title='${editor.#text("finalQuantityPartInfo")}'>${editor.#text("withScrap")}</td>`;
			html += `		</tr>`;
			html += `		<tr>`;
			html += `			<td class='be-quantity' colspan='2' title='${editor.#text("BOMQuantityInfo")}'>${editor.#displayNumber(part.quantity)}</td>`;
			html += `			<td class='be-unit'>${editor.#text("unitShort")}</td>`;
			html += `			<td class='be-scrap' title='${editor.#text("scrapInfo")}'>${editor.#displayNumber(part.scrap)}</td>`;
			html += `			<td class='be-finalQuantityWithoutScrap' colspan='2' title='${editor.#text("finalQuantityPartWithoutAnyScrapInfo")}'>${editor.#displayNumber(part.finalQuantityNoScrap)}</td>`;
			html += `			<td class='be-finalQuantityWithScrap' colspan='2' title='${editor.#text("finalQuantityPartInfo")}'>${editor.#displayNumber(part.finalQuantityWithScrap)}</td>`;
			html += `		</tr>`;

			let materials = part.items.filter(x => x.type != 1);
			if (materials.length > 1) {
				html += `		<tr>`;
				html += `			<td class='be-label' colspan='2'>${editor.#text("materials")}</td>`;
				html += `			<td class='be-label'>${editor.#text("unitShort")}</td>`;
				html += `			<td class='be-label' title='${editor.#text("scrapInfo")}'>${editor.#text("scrap")} %</td>`;
				html += `			<td class='be-label' title='${editor.#text("finalQuantityRawNoScrapNoScrapInfo")}'>${editor.#text("withoutScrap")}</td>`;
				html += `			<td class='be-label' title='${editor.#text("finalQuantityRawNoScrapWithScrapInfo")}'>${editor.#text("withScrap")}</td>`;
				html += `			<td class='be-label' title='${editor.#text("finalQuantityRawWithScrapNoScrapInfo")}'>${editor.#text("withoutScrap")}</td>`;
				html += `			<td class='be-label' title='${editor.#text("finalQuantityRawWithScrapWithScrapInfo")}'>${editor.#text("withScrap")}</td>`;
				html += `		</tr>`;

				part.items.forEach(function (BOMitem) {
					if (BOMitem.type != 1) {
						let finalQuantityNoScrapNoScrap = analogy * BOMitem.quantity;
						let finalQuantityNoScrapWithScrap = part.finalQuantityNoScrap / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);
						let finalQuantityWithScrapNoScrap = part.finalQuantityWithScrap / part.quantity * BOMitem.quantity;
						let finalQuantityWithScrapWithScrap = part.finalQuantityWithScrap / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);

						let typeClass = "";
						if (BOMitem.type == 2) {
							typeClass = "be-raw";
						}
						else if (BOMitem.type == 3) {
							typeClass = "be-return";
						}

						html += `<tr class='be-material ${typeClass}'>`;
						html += `	<td class='be-code be-label'>${BOMitem.code}</td>`;
						html += `	<td class='be-description'>${BOMitem.description}</td>`;
						html += `	<td class='be-unit'>${BOMitem.unit}</td>`;
						html += `	<td class='be-scrap' title='${editor.#text("scrapInfo")}'>${editor.#displayNumber(BOMitem.scrap)}</td>`;
						html += `	<td class='be-finalQuantityWithoutScrap' title='${editor.#text("finalQuantityRawNoScrapNoScrapInfo")}'>${editor.#displayNumber(finalQuantityNoScrapNoScrap)}</td>`;
						html += `	<td class='be-finalQuantityWithScrap' title='${editor.#text("finalQuantityRawNoScrapWithScrapInfo")}'>${editor.#displayNumber(finalQuantityNoScrapWithScrap)}</td>`;
						html += `	<td class='be-finalQuantityWithoutScrap' title='${editor.#text("finalQuantityRawWithScrapNoScrapInfo")}'>${editor.#displayNumber(finalQuantityWithScrapNoScrap)}</td>`;
						html += `	<td class='be-finalQuantityWithScrap' title='${editor.#text("finalQuantityRawWithScrapWithScrapInfo")}'>${editor.#displayNumber(finalQuantityWithScrapWithScrap)}</td>`;
						html += `</tr>`;
					}
				});
			}

			html += `	</table>`;
			html += `</div>`;

			return html;

		}

	}

	#requirementsPerCodeViewHTML(options) {
		let html = "";
		let editor = this;

		// summarize the quantities per code traversing the bom
		var materials = {};
		var materialsArr = [];
		readPart(options.bom, options.bom.quantity, options.targetQuantity);

		// sort the materials by type and by code
		materialsArr.sort(function (a, b) {
			let materialA = materials[a];
			let materialB = materials[b];

			if (materialA.type < materialB.type) return -1;
			if (materialA.type > materialB.type) return 1;

			if (materialA.code < materialB.code) return -1;
			if (materialA.code > materialB.code) return 1;

			return 0;
		});

		html = getHTML();

		return html;

		// calculate the quantities of a part and its materials
		function readPart(part, parentBOMQuantity, parentFinalQuantity) {
			if (part.type == 1) {
				part.finalQuantity = parentFinalQuantity / parentBOMQuantity * part.quantity * (1 + part.scrap / 100);
				addMaterial(part);

				part.items.forEach(function (BOMitem) {
					if (BOMitem.type != 1) {
						BOMitem.finalQuantity = part.finalQuantity / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);
						addMaterial(BOMitem);
					}
					else {
						readPart(BOMitem, part.quantity, part.finalQuantity);
					}
				});
			}
		}

		// add the quantities of a material to the sum
		function addMaterial(material) {
			if (!materials[material.code]) {
				materialsArr.push(material.code);
				materials[material.code] = {
					code: material.code,
					description: material.description,
					type: material.type,
					unit: material.unit,
					scrap: material.scrap,
					finalQuantity: 0,
					uses: 0,
				}
			}
			materials[material.code].finalQuantity += material.finalQuantity;
			materials[material.code].uses += 1;
		}

		// display the results
		function getHTML() {
			let html = "<div class='be-view'>";

			if (options.displayTitle) {
				html += `<div class='be-view-title'>${editor.#text("requirementsPerCodeViewTitle")}</div>`;
			}

			html += `<table class='be-requirementsPerCodeView'>`;
			html += `	<thead>`;
			html += `		<tr>`;
			html += `			<th >${editor.#text("code")}</th>`;
			html += `			<th>${editor.#text("description")}</th>`;
			html += `			<th>${editor.#text("unitShort")}</th>`;
			html += `			<th>${editor.#text("uses")}</th>`;
			html += `			<th>${editor.#text("scrap")} %</th>`;
			html += `			<th title='${editor.#text("finalQuantityWithAllScraps")}'>${editor.#text("finalQuantity")}</th>`;
			html += `		</tr>`;
			html += `	</thead>`;
			html += `	<tbody>`;

			for (let materialEntry of materialsArr) {
				let material = materials[materialEntry];

				var typeClass = "";
				if (material.type == 1) {
					typeClass = `be-part`;
				}
				else if (material.type == 2) {
					typeClass = `be-raw`;
				}
				else if (material.type == 3) {
					typeClass = `be-return`;
				}

				html += `<tr class='${typeClass}'>`;
				html += `	<td class='be-code'>${material.code}</td>`;
				html += `	<td class='be-description'>${material.description}</td>`;
				html += `	<td class='be-unit'>${material.unit}</td>`;
				html += `	<td class='be-uses'>${material.uses}</td>`;
				html += `	<td class='be-scrap'>${editor.#displayNumber(material.scrap)}</td>`;
				html += `	<td class='be-finalQuantity' title='${editor.#text("finalQuantityWithAllScraps")}'>${editor.#displayNumber(material.finalQuantity)}</td>`;
				html += `</tr>`;
			}

			html += `		</tbody>`;
			html += `	</table>`;
			html += `</div>`;
			html += `</div>`;

			return html;
		}

	}

	#requirementsPerRawViewHTML(options) {
		let html = "";
		let editor = this;

		// summarize the quantities per code traversing the bom
		var materials = {};
		var materialsArr = [];
		let analogy = options.targetQuantity / options.bom.quantity;
		readPart(options.bom, options.bom.quantity, options.targetQuantity);

		// sort the materials by type and by code
		materialsArr.sort(function (a, b) {
			let materialA = materials[a];
			let materialB = materials[b];

			if (materialA.type < materialB.type) return -1;
			if (materialA.type > materialB.type) return 1;

			if (materialA.code < materialB.code) return -1;
			if (materialA.code > materialB.code) return 1;

			return 0;
		});

		html = getHTML();

		return html;

		// calculate the quantities of a part and its materials
		function readPart(part, parentBOMQuantity, parentFinalQuantity) {
			if (part.type == 1) {
				part.finalQuantityNoScrapNoScrap = analogy * part.quantity;
				part.finalQuantityNoScrapWithScrap = 0;
				part.finalQuantityWithScrapNoScrap = 0;
				part.finalQuantityWithScrapWithScrap = parentFinalQuantity / parentBOMQuantity * part.quantity * (1 + part.scrap / 100);
				addMaterial(part);

				part.items.forEach(function (BOMitem) {
					if (BOMitem.type != 1) {
						BOMitem.finalQuantityNoScrapNoScrap = analogy * BOMitem.quantity;
						BOMitem.finalQuantityNoScrapWithScrap = part.finalQuantityNoScrapNoScrap / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);
						BOMitem.finalQuantityWithScrapNoScrap = part.finalQuantityWithScrapWithScrap / part.quantity * BOMitem.quantity;
						BOMitem.finalQuantityWithScrapWithScrap = part.finalQuantityWithScrapWithScrap / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);
						addMaterial(BOMitem);
					}
					else {
						readPart(BOMitem, part.quantity, part.finalQuantityWithScrapWithScrap);
					}
				});
			}
		}

		// add the quantities of a material to the sum
		function addMaterial(material) {
			if (!materials[material.code]) {
				materialsArr.push(material.code);
				materials[material.code] = {
					code: material.code,
					description: material.description,
					type: material.type,
					unit: material.unit,
					scrap: material.scrap,
					finalQuantityNoScrapNoScrap: 0,
					finalQuantityNoScrapWithScrap: 0,
					finalQuantityWithScrapNoScrap: 0,
					finalQuantityWithScrapWithScrap: 0,
					uses: 0,
				}
			}
			materials[material.code].finalQuantityNoScrapNoScrap += material.finalQuantityNoScrapNoScrap;
			materials[material.code].finalQuantityNoScrapWithScrap += material.finalQuantityNoScrapWithScrap;
			materials[material.code].finalQuantityWithScrapNoScrap += material.finalQuantityWithScrapNoScrap;
			materials[material.code].finalQuantityWithScrapWithScrap += material.finalQuantityWithScrapWithScrap;
			materials[material.code].uses += 1;
		}

		// display the results
		function getHTML() {
			let html = "<div class='be-view'>";

			if (options.displayTitle) {
				html += `<div class='be-view-title'>${editor.#text("requirementsPerRawViewTitle")}</div>`;
			}

			html += `<table class='be-view be-requirementsPerRawView'>`;
			html += `	<thead>`;
			html += `		<tr>`;
			html += `			<th class="be-empty" colspan="5"></th>`;
			html += `			<th colspan="2">${editor.#text("withoutPartScrap")}</th>`;
			html += `			<th colspan="2">${editor.#text("withPartScrap")}</th>`;
			html += `		</tr>`;
			html += `		<tr>`;
			html += `			<th >${editor.#text("code")}</th>`;
			html += `			<th>${editor.#text("description")}</th>`;
			html += `			<th>${editor.#text("unitShort")}</th>`;
			html += `			<th>${editor.#text("uses")}</th>`;
			html += `			<th>${editor.#text("scrap")} %</th>`;
			html += `			<th title='${editor.#text("finalQuantityRawNoScrapNoScrapInfo")}'>${editor.#text("withoutScrap")}</th>`;
			html += `			<th title='${editor.#text("finalQuantityRawNoScrapWithScrapInfo")}'>${editor.#text("withScrap")}</th>`;
			html += `			<th title='${editor.#text("finalQuantityRawWithScrapNoScrapInfo")}'>${editor.#text("withoutScrap")}</th>`;
			html += `			<th title='${editor.#text("finalQuantityRawWithScrapWithScrapInfo")}'>${editor.#text("withScrap")}</th>`;
			html += `		</tr>`;
			html += `	</thead>`;
			html += `	<tbody>`;

			for (let materialEntry of materialsArr) {
				let material = materials[materialEntry];

				if (material.type == 2) {
					html += `<tr>`;
					html += `	<td class='be-code'>${material.code}</td>`;
					html += `	<td class='be-description'>${material.description}</td>`;
					html += `	<td class='be-unit'>${material.unit}</td>`;
					html += `	<td class='be-uses'>${material.uses}</td>`;
					html += `	<td class='be-scrap'>${editor.#displayNumber(material.scrap)}</td>`;
					html += `	<td class='be-finalQuantityNoScrapNoScrap' title='${editor.#text("finalQuantityRawNoScrapNoScrapInfo")}'>${editor.#displayNumber(material.finalQuantityNoScrapNoScrap)}</td>`;
					html += `	<td class='be-finalQuantityNoScrapWithScrap' title='${editor.#text("finalQuantityRawNoScrapWithScrapInfo")}'>${editor.#displayNumber(material.finalQuantityNoScrapWithScrap)}</td>`;
					html += `	<td class='be-finalQuantityWithScrapNoScrap' title='${editor.#text("finalQuantityRawWithScrapNoScrapInfo")}'>${editor.#displayNumber(material.finalQuantityWithScrapNoScrap)}</td>`;
					html += `	<td class='be-finalQuantityWithScrapWithScrap' title='${editor.#text("finalQuantityRawWithScrapWithScrapInfo")}'>${editor.#displayNumber(material.finalQuantityWithScrapWithScrap)}</td>`;
					html += `</tr>`;
				}
			}

			html += `		</tbody>`;
			html += `	</table>`;
			html += `</div>`;
			html += `</div>`;

			return html;
		}

	}

	#requirementsVerViewHTML(options) {
		let html = "";
		let editor = this;

		// summarize the quantities per code traversing the bom
		var parts = {};
		var partsArr = [];
		let analogy = options.targetQuantity / options.bom.quantity;
		readPart(options.bom, options.bom.quantity, options.targetQuantity);

		// sort the materials by type and by code
		partsArr.sort(function (a, b) {
			let partA = parts[a];
			let partB = parts[b];

			if (partA.code < partB.code) return -1;
			if (partA.code > partB.code) return 1;

			return 0;
		});

		html = getHTML();

		return html;

		// calculate the quantities of a part and its materials
		function readPart(part, parentBOMQuantity, parentFinalQuantity) {
			if (part.type == 1) {
				part.finalQuantityNoScrapNoScrap = analogy * part.quantity;
				part.finalQuantityNoScrapWithScrap = 0;
				part.finalQuantityWithScrapNoScrap = 0;
				part.finalQuantityWithScrapWithScrap = parentFinalQuantity / parentBOMQuantity * part.quantity * (1 + part.scrap / 100);
				addPart(part);

				part.items.forEach(function (BOMitem) {
					if (BOMitem.type != 1) {
						let finalQuantityNoScrapNoScrap = analogy * BOMitem.quantity;
						let finalQuantityNoScrapWithScrap = part.finalQuantityNoScrapNoScrap / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);
						let finalQuantityWithScrapNoScrap = part.finalQuantityWithScrapWithScrap / part.quantity * BOMitem.quantity;
						let finalQuantityWithScrapWithScrap = part.finalQuantityWithScrapWithScrap / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);

						let itemStored = parts[part.code].items.find(p => p.code == BOMitem.code);
						if (!itemStored) {
							itemStored = {
								code: BOMitem.code,
								description: BOMitem.description,
								type: BOMitem.type,
								unit: BOMitem.unit,
								BOMQuantity: BOMitem.quantity,
								scrap: BOMitem.scrap,
								finalQuantityNoScrapNoScrap: finalQuantityNoScrapNoScrap,
								finalQuantityNoScrapWithScrap: finalQuantityNoScrapWithScrap,
								finalQuantityWithScrapNoScrap: finalQuantityWithScrapNoScrap,
								finalQuantityWithScrapWithScrap: finalQuantityWithScrapWithScrap
							}
							parts[part.code].items.push(itemStored);
						}
						else {
							itemStored.finalQuantityNoScrapNoScrap += finalQuantityNoScrapNoScrap;
							itemStored.finalQuantityNoScrapWithScrap += finalQuantityNoScrapWithScrap;
							itemStored.finalQuantityWithScrapNoScrap += finalQuantityWithScrapNoScrap;
							itemStored.finalQuantityWithScrapWithScrap += finalQuantityWithScrapWithScrap;
						}
					}
					else {
						readPart(BOMitem, part.quantity, part.finalQuantityWithScrapWithScrap);
					}
				});
			}
		}

		// add the quantities of a material to the sum
		function addPart(part) {
			if (!parts[part.code]) {
				partsArr.push(part.code);
				parts[part.code] = {
					code: part.code,
					description: part.description,
					type: part.type,
					unit: part.unit,
					BOMQuantity: part.quantity,
					scrap: part.scrap,
					finalQuantityNoScrapNoScrap: 0,
					finalQuantityNoScrapWithScrap: 0,
					finalQuantityWithScrapNoScrap: 0,
					finalQuantityWithScrapWithScrap: 0,
					uses: 0,
					items: []
				}
			}
			parts[part.code].finalQuantityNoScrapNoScrap += part.finalQuantityNoScrapNoScrap;
			parts[part.code].finalQuantityNoScrapWithScrap += part.finalQuantityNoScrapWithScrap;
			parts[part.code].finalQuantityWithScrapNoScrap += part.finalQuantityWithScrapNoScrap;
			parts[part.code].finalQuantityWithScrapWithScrap += part.finalQuantityWithScrapWithScrap;
			parts[part.code].uses += 1;
		}

		// display the results
		function getHTML() {
			let html = "<div class='be-view'>";

			if (options.displayTitle) {
				html += `<div class='be-view-title'>${editor.#text("requirementsVerViewTitle")}</div>`;
			}

			html += `<table class='be-requirementsVerView'>`;
			html += `	<thead>`;
			html += `		<tr>`;
			html += `			<th >${editor.#text("code")}</th>`;
			html += `			<th>${editor.#text("uses")}</th>`;
			html += `			<th>${editor.#text("material")}</th>`;
			html += `			<th>${editor.#text("description")}</th>`;
			html += `			<th>${editor.#text("unitShort")}</th>`;
			html += `			<th>${editor.#text("scrap")} %</th>`;
			html += `			<th title='${editor.#text("BOMQuantityInfo")}'>${editor.#text("BOMQuantity")}</td>`;
			html += `			<th title='${editor.#text("finalQuantityPartInfo")}'>${editor.#text("quantity")}</td>`;
			html += `		</tr>`;
			html += `	</thead>`;
			html += `	<tbody>`;

			for (let partEntry of partsArr) {
				let part = parts[partEntry];

				html += `<tr class="be-part">`;
				html += `	<td class='be-code'>${part.code}</td>`;
				html += `	<td class='be-uses'>${part.uses}</td>`;
				html += `	<td class='be-code'></td>`;
				html += `	<td class='be-description'>${part.description}</td>`;
				html += `	<td class='be-unit'>${part.unit}</td>`;
				html += `	<td class='be-scrap'>${editor.#displayNumber(part.scrap)}</td>`;
				html += `	<td class='be-BOMQuantity' title='${editor.#text("BOMQuantityInfo")}'>${editor.#displayNumber(part.BOMQuantity)}</td>`;
				html += `	<td class='be-finalQuantityWithScrapWithScrap' title='${editor.#text("finalQuantityRawWithScrapWithScrapInfo")}'>${editor.#displayNumber(part.finalQuantityWithScrapWithScrap)}</td>`;
				html += `</tr>`;

				for (let material of part.items) {
					var typeClass = "";
					if (material.type == 2) {
						typeClass = `be-raw`;
					}
					else if (material.type == 3) {
						typeClass = `be-return`;
					}

					html += `<tr class="${typeClass}">`;
					html += `	<td class='be-code be-empty'></td>`;
					html += `	<td class='be-uses be-empty'></td>`;
					html += `	<td class='be-code'>${material.code}</td>`;
					html += `	<td class='be-description'>${material.description}</td>`;
					html += `	<td class='be-unit'>${material.unit}</td>`;
					html += `	<td class='be-scrap'>${editor.#displayNumber(material.scrap)}</td>`;
					html += `	<td class='be-BOMQuantity' title='${editor.#text("BOMQuantityInfo")}'>${editor.#displayNumber(material.BOMQuantity)}</td>`;
					html += `	<td class='be-finalQuantityWithScrapWithScrap' title='${editor.#text("finalQuantityRawWithScrapWithScrapInfo")}'>${editor.#displayNumber(material.finalQuantityWithScrapWithScrap)}</td>`;
					html += `</tr>`;
				}
			}

			html += `		</tbody>`;
			html += `	</table>`;
			html += `</div>`;
			html += `</div>`;

			return html;
		}

	}

	#requirementsTreeViewHTML(options) {
		let html = "<div class='be-view'>";
		let editor = this;

		if (options.displayTitle) {
			html += `	<div class='be-view-title'>${this.#text("requirementsTreeViewTitle")}</div>`;
		}

		html += `	<div class='be-view be-requirementsTreeView'>`;
		html += partHTML(options.bom, options.bom.quantity, options.targetQuantity);
		html += `	</div>`;
		html += `</div>`;

		return html;


		function partHTML(part, parentBOMQuantity, parentFinalQuantity) {
			let html = "";
			let expandedClass = options.minimized ? "be-hidden" : "";

			// sort the materials by type
			part.items.sort(function (a, b) {
				if (a.type < b.type) return -1;
				if (a.type > b.type) return 1;

				return 0;
			});

			if (part.type == 1) {
				part.finalQuantity = parentFinalQuantity / parentBOMQuantity * part.quantity * (1 + part.scrap / 100);;

				html += `<div class='be-part'>`;
				html += `	<div class='be-part-header'>`;
				html += `			<div class='be-expand-materials'>+</div>`;
				html += `			<div class='be-code'>${part.code}</div>`;
				html += `			<div class='be-description'>${part.description}</div>`;
				html += `			<div class='be-scrap' title='${editor.#text("scrapInfo")}'>${editor.#displayNumber(part.scrap)}%</div>`;
				html += `			<div class='be-finalQuantity' title='${editor.#text("finalQuantityPartInfo")}'>${editor.#displayNumber(part.finalQuantity)}</div>`;
				html += `			<div class='be-unit'>${part.unit}</div>`;
				html += `	</div>`;

				html += `	<div class='be-part-materials ${expandedClass}'>`;
				part.items.forEach(function (BOMitem) {
					if (BOMitem.type == 1) {
						html += partHTML(BOMitem, part.quantity, part.finalQuantity);
					}
					else {
						let finalQuantity = part.finalQuantity / part.quantity * BOMitem.quantity * (1 + BOMitem.scrap / 100);

						let typeClass = "";
						if (BOMitem.type == 2) {
							typeClass = "be-raw";
						}
						else if (BOMitem.type == 3) {
							typeClass = "be-return ";
						}
						html += `<div class='be-material ${typeClass}'>`;
						html += `	<div class='be-code'>${BOMitem.code}</div>`;
						html += `	<div class='be-description'>${BOMitem.description}</div>`;
						html += `	<div class='be-scrap' title='${editor.#text("scrapInfo")}'>${editor.#displayNumber(BOMitem.scrap)}%</div>`;
						html += `	<div class='be-finalQuantity' title='${editor.#text("finalQuantityRawWithScrapWithScrapInfo")}'>${editor.#displayNumber(finalQuantity)}</div>`;
						html += `	<div class='be-unit'>${BOMitem.unit}</div>`;
						html += `</div>`;
					}
				});
				html += `	</div>`;

				html += `</div>`;
			}

			return html;
		}
	}

}

