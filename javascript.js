// javascript.js
$(function () {
    // Declare variables
    var paint = false;  // Painting or erasing status
    var paint_erase = "paint";  // Default mode is painting
    var canvas = document.getElementById("paint");
    var ctx = canvas.getContext("2d");
    var container = $("#container");

    // Mouse position object
    var mouse = { x: 0, y: 0 };

    // Load saved drawing from localStorage on page load
    if (localStorage.getItem("imgCanvas")) {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            console.log("✅ Image loaded from localStorage!");
        };
        img.src = localStorage.getItem("imgCanvas");
    } else {
        console.log("⚠️ No saved drawing found.");
    }

    // Set initial drawing parameters
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Mouse down event (Start drawing)
    container.mousedown(function (e) {
        paint = true;
        ctx.beginPath();
        mouse.x = e.pageX - container.offset().left;
        mouse.y = e.pageY - container.offset().top;
        ctx.moveTo(mouse.x, mouse.y);
    });

    // Mouse move event (Drawing)
    container.mousemove(function (e) {
        mouse.x = e.pageX - container.offset().left;
        mouse.y = e.pageY - container.offset().top;
        if (paint) {
            ctx.strokeStyle = (paint_erase === "paint") ? $("#paintColor").val() : "white";
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    });

    // Mouse up event (Stop drawing)
    container.mouseup(function () {
        paint = false;
    });

    // Mouse leave event (Stop drawing)
    container.mouseleave(function () {
        paint = false;
    });

    // Reset button (Clear canvas)
    $("#reset").click(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paint_erase = "paint";
        $("#erase").removeClass("eraseMode");
        localStorage.removeItem("imgCanvas");
        console.log("🧹 Canvas reset & localStorage cleared!");
    });

    // Save button (Save drawing)
    $("#save").click(function () {
        if (typeof localStorage !== "undefined") {
            let imageData = canvas.toDataURL("image/png");
    
            // Save to localStorage
            localStorage.setItem("imgCanvas", imageData);
            console.log("💾 Drawing saved to localStorage!");
    
            // Create a temporary download link
            let downloadLink = document.createElement("a");
            downloadLink.href = imageData;
            downloadLink.download = "drawing.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
    
            alert("✅ Drawing saved and downloaded!");
        } else {
            alert("⚠️ Your browser does not support local storage!");
        }
    });

    // Erase button (Toggle between paint & erase)
    $("#erase").click(function () {
        paint_erase = (paint_erase === "paint") ? "erase" : "paint";
        $(this).toggleClass("eraseMode");
    });

    // Change color input
    $("#paintColor").change(function () {
        $("#circle").css("background-color", $(this).val());
    });

    // Change line width using slider
    $("#slider").slider({
        min: 3,
        max: 30,
        slide: function (event, ui) {
            $("#circle").height(ui.value);
            $("#circle").width(ui.value);
            ctx.lineWidth = ui.value;
        }
    });
});
