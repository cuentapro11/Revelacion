(function(){
  var IMG_SRC = {
    "img0": "images/img0.png",
    "img1": "images/img1.png",
    "img2": "images/img2.png",
    "img3": "images/img3.png",
    "img4": "images/img4.png",
    "img5": "images/img5.png",
    "img6": "images/img6.png",
    "img7": "images/img7.png",
    "img8": "images/img8.png",
    "img9": "images/img9.png",
    "img10": "images/img10.png",
    "img11": "images/img11.png",
    "img12": "images/img12.png",
    "img13": "images/img13.png",
    "img14": "images/img14.png",
    "img15": "images/img15.png",
  };
  var root = document.documentElement;
  for (var k in IMG_SRC) {
    root.style.setProperty('--' + k, "url('" + IMG_SRC[k] + "')");
  }
  document.querySelectorAll('[data-img]').forEach(function(el){
    var id = el.getAttribute('data-img');
    if (IMG_SRC[id]) el.src = IMG_SRC[id];
  });
})();