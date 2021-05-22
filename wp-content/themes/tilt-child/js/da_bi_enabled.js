(function ($) {
  $(document).ready(function () {

    const da_bi_comparision = {
      title: [
        "Analytics & Reports",
        "Business Meetings",
        "Experimenting Ideas",
        "Planning and Strategy",
        "Decision Making",
        "Iterate at Speed",
        "Fact Finding",
        "Recruitment and Retention",
      ],
      without_da_bi: [
        "1) Takes a while \nto acquire data \nreports and \nanalysis",
        "2) Business \ndiscussions are \nlargely based \non opinions",
        "3) Experiments \nand tests are \ntrial and error",
        "4) Employees and \nExecutives don’t \nknow what they \ndon’t know",
        "5) Basic Numbers \nand Reporting \nwith Limited \nBusiness \nInsights",
        "6) Business progress \nand growth \nmeasured with \nbasic and high \nlevel numbers \nsuch as sales and \nno. of customers",
        "7) Constantly lack \nof new and \nimpactful \nbusiness \nstrategies and \ntactics",
        "8) Hiring and \nretaining talent \nis challenging \ndue to complexity \nof business and \ninformation loss",
      ],
      with_da_bi: [
        "1) Measure and track \nbusiness progress \nquickly & clearly ",
        "2) Everyone is on the \nsame page in business \nmeetings",
        "3) If someone has an idea, \nthey can find the data \nto back the idea \nor experiment",
        "4) Employees of all levels \nand departments will be \nbetter at planning and \nexecuting with data",
        "5) Decision makers can \nlook at the right things \nwith data, and make \nsound business \ndecisions.",
        "6) Iterate and innovate \nproducts quickly and \ncontinuously by looking \nat changes in key \nperformance metrics",
        "7) C Level Executives and \nManagers can ask \nbusiness questions and \nget answers quickly",
        "8) Hire great talent \neasier with strong \ndata driven culture",
      ]
    };

    let unprocessed_card1_text = SVG('#unprocessed-card-1-text');
    let unprocessed_card2_text = SVG('#unprocessed-card-2-text');
    let processed_card_title_text = SVG('#processed-card-title');
    let processed_card_text = SVG('#processed-card-text');
    let text = $('.text-d');
    let first_index = 0;
    let second_index = 1;
    const title_settings = {
      family: 'Noah',
      size: 28,
      weight: 700,
      leading: '1em',
    };
    const font_settings = {
      family: 'Lato',
      size: 16,
      weight: 500,
      leading: '1em',
    };

    if (unprocessed_card1_text && unprocessed_card2_text && processed_card_title_text && processed_card_text) {

      let up1_bb = $('#unprocessed-card-1-text')[0].getBBox();
      let up2_bb = $('#unprocessed-card-2-text')[0].getBBox();
      let pt_bb = $('#processed-card-title')[0].getBBox();
      let p_bb = $('#processed-card-text')[0].getBBox();
      let text_position_1 = { x: up1_bb.x - 6, y: up1_bb.y - 18 };
      let text_position_2 = { x: up2_bb.x - 6, y: up2_bb.y - 18 };
      let text_position_3 = { x: pt_bb.x - 2, y: pt_bb.y - 10 };
      let text_position_4 = { x: p_bb.x - 2, y: p_bb.y };

      unprocessed_card1_text.clear().text(da_bi_comparision.without_da_bi[first_index]).font(font_settings).attr(text_position_1);
      unprocessed_card2_text.clear().text(da_bi_comparision.without_da_bi[second_index]).font(font_settings).attr(text_position_2);
      processed_card_title_text.clear().text(da_bi_comparision.title[first_index]).font(title_settings).attr(text_position_3);
      processed_card_text.clear().text(da_bi_comparision.with_da_bi[first_index]).font(font_settings).attr(text_position_4);

      $("#box-3").hide();

      $('#go-button').on('click', () => {

        $('#converter-pipe').addClass('process');
        $("#box-3").show(1250);
        $("g[id^='unprocessed-card-holder']").addClass('shrink');
        $("g[id^='box']").addClass('move');

        if ((da_bi_comparision.without_da_bi.length - 1 == first_index)
          && (da_bi_comparision.with_da_bi.length - 1 == second_index - 1)) {
          first_index = 0;
          second_index = 1;
        } else if (da_bi_comparision.without_da_bi.length - 1 == second_index) {
          first_index++;
          second_index = 0;
        } else {
          first_index++;
          second_index++;
        }

        $('#processed-card-holder').addClass('fade-out');
        text.addClass('fade-out');
        setTimeout(() => {
          text.removeClass('fade-out');
          $('#processed-card-holder').removeClass('fade-out');
          unprocessed_card1_text.clear().text(da_bi_comparision.without_da_bi[first_index]).attr(text_position_1);
          unprocessed_card2_text.clear().text(da_bi_comparision.without_da_bi[second_index]).attr(text_position_2);
          processed_card_title_text.clear().text(da_bi_comparision.title[first_index]).attr(text_position_3);
          processed_card_text.clear().text(da_bi_comparision.with_da_bi[first_index]).attr(text_position_4);

          if (second_index == 0) {
            second_index = da_bi_comparision.with_da_bi.length;
          }

        }, 1350);
        
        setTimeout(() => {
          $("#box-2").hide(515);
          setTimeout(() => {
            $('#converter-pipe').removeClass('process');
          }, 350);
          setTimeout(() => {
            $("g[id^='box']").removeClass('move');
            $("g[id^='unprocessed-card-holder']").removeClass('shrink');
            $("#box-2").show();
            $("#box-3").hide();
          }, 550);
        }, 900);
        
      });
    }
  });

})(jQuery);