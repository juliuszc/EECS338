var TRANSITION_DURATION = 500;
var img_exists = false;

KangoAPI.onReady(function() {
  $('.content-pane').hide();
  $('#activity').show();
  buildActivityTable();
  buildActivityTable2();

  $('#popup-close').click(function(event) {
    KangoAPI.closeWindow()
  });

  $('#activity-nav,#activity-link').click(function() {
    $('ul.nav li').removeClass('active');
    $(this).addClass('active');
    $('.content-pane').hide({
      duration: TRANSITION_DURATION
    });
    $('#activity').show({
      duration: 0
    });
  });
  //hide the other chart and its corresponding labels
  $(document).ready(function() {
      $('#chart').hide();
      $('#cat-source-table').hide();
      $('#chart-title').hide();
  });
  
  $('#toggle-chart').click(function () {
      if (document.getElementById('toggle-chart').innerHTML == 'Online Activity') {
          document.getElementById('toggle-chart').innerHTML = 'Reading Activity';
      }
      else {
          document.getElementById('toggle-chart').innerHTML = 'Online Activity';
      }
      $('#chart-title, #chart-title2').toggle(500);
      $('#chart, #chart2').toggle(500);
      $('#cat-source-table, #cat-source-table2').toggle(500);
  });
//create chart
  nv.addGraph(function() {
    var width = 320;
    var height = 300;
    var chart = nv.models.pieChart()
      .x(function(d) { return d.key; })
      .values(function(d) {
          return d;
      })
      .showLabels(false)
      .color(PIE_CHART_COLORS)
      .donut(true);
    d3.select('#chart svg')
      .datum([pieChartData()])
      .transition().duration(1200)
      .attr('width', width + 50)
      .attr('height', height)
      .attr("font-size", "12px") 
      .call(chart);
    return chart;
  });

  nv.addGraph(function () {
      var width = 320;
      var height = 300;
      var chart2 = nv.models.pieChart()
        .x(function (d) { return d.key; })
        .values(function (d) {
            return d;
        })
        .showLabels(false)
        .color(PIE_CHART_COLORS)
        .donut(true);
      d3.select('#chart2 svg')
        .datum([mainPieChartData()])
        .transition().duration(1200)
        .attr('width', width + 50)
        .attr('height', height)
        .attr("font-size", "12px")
        .call(chart2);
      // to deal with d3 bug in legend positioning
      $('.nvd3 .nv-legend:eq(1)').children(0).attr("transform", "translate(4,5)");
      return chart2;
  });
//twitter share function
  d3.select("#iframe-block").on("mouseover", function () {
      var chartTag;
      if ($("#chart2").css("display") == "none")
      {
          chartTag = "#chart svg";
      }
      else {
          chartTag = "#chart2 svg";
      }
      var html = d3.select(chartTag)
           .attr("version", 1.1)
           .attr("xmlns", "http://www.w3.org/2000/svg")
           .node().parentNode.innerHTML;

      var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
      var img = '<img src="' + imgsrc + '">';

      var canvas = document.querySelector("canvas"),
          context = canvas.getContext("2d");

      var image = document.createElement('img');
      image.src = imgsrc;
      image.onload = function () {
          context.drawImage(image, 0, 0);

          var canvasdata = canvas.toDataURL("image/png");

          var pngimg = '<img src="' + canvasdata + '">';

          var a = document.createElement("a")
          a.href = canvasdata;
          a.click();
          var response;
          try {
              var img = canvas.toDataURL('image/png', 1.0).split(',')[1];
          } catch (e) {
              var img = canvas.toDataURL().split(',')[1];
          }
     
          if (!img_exists) {
              img_exists = true;
              $.ajax({
                  url: 'https://api.imgur.com/3/image',
                  type: 'POST',
                  headers: {
                      'Authorization': 'Client-ID 2a5ea91124424c6'
                  },
                  data: {
                      image: img,
                  },
              }).success(function (data) {
                  document.getElementById('save').src = "https://platform.twitter.com/widgets/tweet_button.html?text=This is my internet usage breakdown.&url=" + data.data.link;
                  $('#iframe-blocker').hide();
              }).error(function () {
                  alert('Could not save photo. Sorry :(');
              });
          }
      };

  });
  
//set ignore domain
  $('.ignore-domain').click(function(e) {
    var target = $(e.target);
    var domain = target.data('domain');
    setIgnoreDomain(domain);
    cleanURLMeta();
    reloadCategories();
    target.closest('tr').remove(); 
  });
//go to settings
  $('.settings-icon').click(function() {
    console.log('settings');
    $('ul.nav li').removeClass('active');
    $('.content-pane').hide({
      duration: TRANSITION_DURATION
    });
    $('#settings').show({
      duration: 0
    });
    showSettings();
    $('#num-reporting-days').html(numReportingDays);
  });

  $('.edit-num-reporting-days').click(function() {
    $('#num-reporting-days').attr('contenteditable', true).focus();
  });


  /* http://stackoverflow.com/a/6263537 */
  $('body').on('focus', '[contenteditable]', function() {
      var $this = $(this);
      $this.data('before', $this.html());
      return $this;
  }).on('blur', '[contenteditable]', function() {
      var $this = $(this);
      if ($this.data('before') !== $this.html()) {
          $this.data('before', $this.html());
          $this.trigger('change');
      }
      return $this;
  });

  $('#num-reporting-days').change(function(evt) {
    var num = parseInt($('#num-reporting-days').html());
    if (num == NaN) {
        return;
    }
    setReportingDays(num);
    $('#num-reporting-days').attr('contenteditable', false);
  });
});

