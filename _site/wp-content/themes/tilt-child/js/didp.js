(function ($) {
  $(document).ready(function () {

    let speechArr = [
      {
        title: "Reliable Data Quality",
        desc: "Avoid inaccurate, missing, duplicate data & manage data drift",
        speech_1: "“I’ve done my data \nanalysis and the answer \nis 25.”",
        speech_2: "“But mine is 17.”",
      },
      {
        title: "Scalable Data Infrastructure",
        desc: "Equipped to meet demand spikes and data product feature upgrades",
        speech_1: "“I can’t seem to find \ndata for a few weeks in \nDecember.. ”",
        speech_2: "“Oh about that, there was a \nsudden spike in traffic and \nwe couldn’t capture it.”",
      },
      {
        title: "Loss of Data Confidence",
        desc: "Data Users like data anlaysts, managers and C Level executives may be less reliant on data.",
        speech_1: "“It’ll take me at least 3 \nweeks to find out why there \nwas a sudden loss in sales ”",
        speech_2: "“Ok. Dont spend your time on \nthat. Can you deal with the task \nthat I assigned to you earlier?”",
      }
    ];

    // Initialize slider items
    let speech_bubble = $('#speech-bubble-1, #speech-bubble-2');
    let rdi_title = $('#rdi-title');
    let rdi_desc = $('#rdi-desc');
    let speech1 = SVG('#speech-bubble-text-1');
    let speech2 = SVG('#speech-bubble-text-2');
    let arrow_left = $(".rdi-arrow-left");
    let arrow_right = $(".rdi-arrow-right");
    let index = 0;
    const font_settings = {
      family: 'Lato',
      size: 20,
      weight: 500,
      leading: '1.5em',
    };

    // get rect from dom
    if (rdi_title && rdi_desc && speech1 && speech2) {

      rdi_title.text(speechArr[index].title);
      rdi_desc.text(speechArr[index].desc);

      let bb1 = $('#speech-bubble-text-1')[0].getBBox();
      let bb2 = $('#speech-bubble-text-2')[0].getBBox();
      let text_position_1 = { x: bb1.x, y: bb1.y - 5 };
      let text_position_2 = { x: bb2.x, y: bb2.y - 5 };

      speech1.clear().text(speechArr[0].speech_1).font(font_settings).attr(text_position_1);
      speech2.clear().text(speechArr[0].speech_2).font(font_settings).attr(text_position_2).dmove(-32, -32);

      function animateRDI() {
        speech_bubble.removeClass('fade-in');
        speech_bubble.addClass('fade-out');

        rdi_title.addClass('hide-text');
        rdi_desc.addClass('hide-text');

        setTimeout(() => {
          speech_bubble.removeClass('fade-out');
          speech_bubble.addClass('fade-in');

          rdi_title.removeClass('hide-text');
          rdi_desc.removeClass('hide-text');

          // Title & Description
          rdi_title.text(speechArr[index].title);
          rdi_desc.text(speechArr[index].desc);

          // SVG Library functions
          speech1.clear().text(speechArr[index].speech_1).attr(text_position_1);
          speech2.clear().text(speechArr[index].speech_2).attr(text_position_2).dmove(-32, -32);
        }, 500);
      }

      arrow_left.on("click", () => {
        index = index - 1;
        if (index == -1) {
          index = speechArr.length - 1;
        }
        animateRDI();
      });
      arrow_right.on("click", () => {
        if ((speechArr.length - 1) == index) {
          index = 0;
        } else {
          index = index + 1;
        }
        animateRDI();
      });
    }

  });

})(jQuery);