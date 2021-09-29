    function doUndo() { 
        document.execCommand('undo', false, null); 
    } 

    function doRedo() { 
        document.execCommand('redo', false, null); 
    } 

    Undo.addEventListener("click", doUndo, false); 
    Redo.addEventListener("click", doRedo, false); 