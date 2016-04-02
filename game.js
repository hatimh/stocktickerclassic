$(function() {
  $('input').removeAttr('type');
  fillTable();
  newGame();
  $('body').on('click','#roll',function(){roll();});
  $('.up').hover(
    function(){$(this).css('border-bottom','7px solid '+ $(this).closest('tr').children('td').children('label').css('background-color'));    
    },
    function(){$(this).removeAttr('style')});
  $('.down').hover(
    function(){$(this).css('border-top','7px solid '+ $(this).closest('tr').children('td').children('label').css('background-color'));    
    },function(){$(this).removeAttr('style')});
  $('.up').click(function(){     
  });
  $('.up').click(function(){
    var name = $(this).siblings('input').attr('id');
    var id = findId(name);
    var cost = dice1[id].factor*500;
    var cash = $('#cash').text()*1;
    var amount = $(this).siblings('input').val()*1;
    if (cash >= cost) {
      $('#cash').text(cash - cost);
      $(this).siblings('input').val(amount + 500);
    }
  });
  $('.down').click(function(){
    var amount = $(this).siblings('input').val()*1;    
    if (amount > 0) {
      var name = $(this).siblings('input').attr('id');
      var id = findId(name);
      var cost = dice1[id].factor*500;
      var cash = $('#cash').text()*1;      
      $('#cash').text(cash + cost);
      $(this).siblings('input').val(amount - 500);
    };
  });  
});

function movePawn(factor, id, img) {
  img.removeAttr('style');
  $(".board tr:nth-child("+ Math.floor((1 -factor)*20 + 22) +") td:nth-child(" + (id + 1) + ")").append(img);
}

var Commodity = function(id,name,img) {
  this.id  = id;
  this.name = name;
  this.img = img;
  this.factor = 1.00;
  this.up = function(amt) {
    if (!(this.factor + (amt/100) >= 2)){
      this.factor = (this.factor + amt/100).toFixed(2)*1;
      //this.img.slideUp(500, "linear", movePawn(this.factor, this.id,this.img));
      //this.img.animate({'margin-top': '-='+((amt/5)*18 + 30)},500).removeAttr('style');
      movePawn(this.factor,this.id, this.img);                  
    } else {
      //play sound, animate?
      this.factor = 1;
      $('#' + this.name).val($('#' + this.name).val()*2);
      this.reset();
    };
  };
  this.down = function(amt) {
    if (!(this.factor + (amt/100) <= 0)){
      this.factor = (this.factor - amt/100).toFixed(2)*1;
      this.img.slideDown(500, "linear",movePawn(this.factor, this.id,this.img));
      //this.img.animate({'margin-top': '+=' +((amt/5)*18 + 30)},500).removeAttr('style');
      movePawn(this.factor,this.id, this.img);                
    } else {
      this.factor = 1;
      $('#' + this.name).val(0);
      this.reset();
    };
  };
  this.pay = function(amt) {
    if (this.factor >= 1) {
      $('#cash').text(Math.floor($('#cash').text()*1 + (amt*$('#' + this.name).val()/100)));
    }
  };
  this.reset = function() {
    this.factor = 1;    
    $(".board tr:nth-child(22) td:nth-child(" + (this.id + 1) + ")").append(this.img);
  };
};

var grain = new Commodity(1,"Grain",$('<img src = "images/grain.png" class = "pawn">'));
var industry = new Commodity(2, "Industry",$('<img src = "images/industry.png" class = "pawn">'));
var bonds = new Commodity(3, "Bonds",$('<img src = "images/bonds.png" class = "pawn">'));
var oil = new Commodity(4, "Oil",$('<img src = "images/oil.png" class = "pawn">'));
var silver = new Commodity(5, "Silver",$('<img src = "images/silver.png" class = "pawn">'));
var gold = new Commodity(6, "Gold",$('<img src = "images/gold.png" class = "pawn">'));
var dice1 = [grain, industry, bonds, oil, silver, gold];
var dice2 = ["up", "down", "pay", "down", "pay", "up"];
var dice3 = [5, 10, 20, 10, 20, 5];

function fillTable() {
  var table = $('.board');
  for (i = 40; i>-1; i--) {
    var tr = $('<tr>');
    
    for (j=1; j<9;j++) {
      var td =$('<td>');
      if (j==1 || j==8){
        td.text(i*5);            
      };
      tr.append(td);      
    };
    // if (i == 20) {
    //     tr.css("border","5px solid red");
    // }
    table.append(tr);
  };
  var tr = $('<tr>');
  tr.html($('table tr').first().html());
  table.append(tr);
};

function newGame() {
  resetPawns();
  $('input').val(0);
  $('#cash').text(5000);
  $('#equity').text(5000);
}

function resetPawns() {
   for (i=0;i<6;i++) {
    dice1[i].reset();
   }
};

function roll() {
  var x = [
    "transform: rotateX(500deg) rotateZ(540deg) rotateY(510deg);",
    "transform: rotateX(410deg) rotateZ(390deg) rotateY(360deg);",
    "transform: rotateX(410deg) rotateZ(390deg) rotateY(270deg);",
    "transform: rotateX(230deg) rotateZ(150deg) rotateY(360deg);",
    "transform: rotateX(410deg) rotateZ(390deg) rotateY(450deg);",
    "transform: rotateX(320deg) rotateZ(180deg) rotateY(390deg);"
  ];     
  var rand1=Math.floor(Math.random()*6);
  var rand2=Math.floor(Math.random()*6);
  var rand3=Math.floor(Math.random()*6);
  $("#roll").attr("disabled","true");
  $("#dice1").attr("style", x[rand1] + "animation-name: roll;");
  $("#dice2").attr("style", x[rand2] + "animation-name: roll;");
  $("#dice3").attr("style", x[rand3] + "animation-name: roll;");
  setTimeout(function(){
      $("#dice1").attr("style", x[rand1]);
      $("#dice2").attr("style", x[rand2]);
      $("#dice3").attr("style", x[rand3]);
      dice1[rand1][dice2[rand2]](dice3[rand3]);
      calcEquity();
      $("#roll").removeAttr("disabled");

  }, 700);   
};

function findId(name) {
  for (i = 0;i<6;i++) {
    if (dice1[i].name == name) {
      return i;
    };
  };
};

function calcEquity() {
  var equity = $('#cash').text()*1;
  for (i = 0; i<6;i++){
    equity += dice1[i].factor * $('input')[i].value;
  }
  $('#equity').text(Math.floor(equity));
}