var search_object = {
  data: "",
  post_number: 0,
  update: function (data) {
    var posts = data.posts;
    var result = '';
    var current = search_object.post_number;
    $('#result_time').html('About ' + (parseInt(data.totalResults) + parseInt(data.moreResultsAvailable)) + ' results (0.16 seconds)');

    for (var i = current; i < 10 + current; i++) {
      result += '<li class="full_width" >';
      result += '<h2><a href="'+ posts[i].url +'" class="title_r no_overflow">'+ posts[i].thread.title +'</a></h2>';
      result +='<a href="'+ posts[i].url +'" class="link_r no_overflow">'+ posts[i].url +'</a>';
      result +='<p class="result_t no_overflow">'+ posts[i].text +'</p>';
      result +='</li>';
      search_object.post_number++;
      if(search_object.post_number === data.totalResults )
        break;
    };
    $('#result').append(result);
  },

  init: function () {
    $("#settings_button").click( function () {
      $("#drop_down").toggle("slow");
    });

    $('#drop_input_b').click( function (e) {
      e.preventDefault();
      var custom = $('#search_field_2').val() +'%20%22'+''+'%22%20-'+$('#minus_exact_input').val();
      console.log(custom);
      search_object.make_json(custom, "blogs");
    });

    $(".do_change").click( function (event) {
      $(".do_change").removeClass('active');
      $(this).addClass('active');
      event.preventDefault();
      search_object.make_json($('#search_field_2').val(), $(this).text());
    });

    $('#google_search').click( function (event) {
      event.preventDefault();
      var search = $('#search_field').val();
      search_object.make_json(search, "blogs");

      $('#content').addClass('diff_content');
      $('head').append('<link rel="stylesheet" href="css/result.css">');
      $('#content_2').removeClass('diff_content');
      $('#search_field_2').val(search);
      $("#drop_down").hide();
    });

    $("#more").click( function () {
      $("#more").text('Loading...');
      $("#more").prop('disabled', true);
      if(search_object.post_number === search_object.data.totalResults ){
        $("#more").text('No more results');
      }
      else if (search_object.post_number === 99)
      {
        $('#result').html("");
        $('section').hide();
        $('#loading').show();
        search_object.post_number = 0;
        var api = 'https://webhose.io/'+ search_object.data.next +'';
        
        $.getJSON(api, search_object.application);
      }
      else {
        search_object.update(search_object.data);
        $("#more").prop('disabled', false);
        $("#more").text('Load More');
      }
    });

    $('#search_b').click( function (e) {
      e.preventDefault();
      var search = $('#search_field_2').val();
      search_object.make_json(search, "blogs");
    });
  }, 

  application: function (data) {
    console.log(data);
    if (data.totalResults === 0){
      $('section').show();
      $('#loading').hide();
    }
    else
    {  
      search_object.data = data;
      search_object.update(data);
      $('#loading').hide();
      $('section').show();
    }
  },

  make_json: function (search, type) {
    search_object.post_number = 0;
    $('#result').html("");
    $('section').hide();
    $('#loading').show();
    var api = "https://webhose.io/search?token=7ca4ad94-29df-4290-96fe-fd7878a37cd3";
    var options = {
      format: "json",
      q: search,
      language: "english",
      site_type: type
    };
    $.getJSON(api, options, search_object.application);
  }  
}  
search_object.init();  
