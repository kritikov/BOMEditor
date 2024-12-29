BomEditor - Bill of Material (BOM) Creation and Management in the Browser

BomEditor is a JavaScript class that allows the creation and management of a Bill of Material (BOM) in the browser. The library is designed 
to simplify the process of designing, editing and calculating the required materials for construction or production projects.

It provides two types of functionality: the editor where the product is designed with drag and drop functions, and the views 
where the various results resulting from the design are presented, such as the total material requirements. There is a history to allow undo / redo functions 
and provides support in two languages, English and Greek.

The basic components of the BOM in the BomEditor design are three:

materials: the raw materials used during the production process to create a component or the final product.
returns: materials created during the production process without being needed in the next production phase but possibly needing code to be utilized differently
components: derived by-products created during a production process phase and needed for the next phase. They can use materials or other components.

BomEditor includes two files, one in javascript and one in css. The javascript includes the BomEditor class and its use is done by declaring an instance, 
passing as a parameter the div in which the editor or viewer will be created. It is possible to use multiple instances on the same page so that there are 
different editors if this is desired. The class uses the be- prefix to declare the various css classes included in the corresponding file.

You can read more informations about using it in the 'manual EN.txt' file. The library has been used by the online application CS11 and you can see it 
in action at https://nkode.gr/EN/CS11
