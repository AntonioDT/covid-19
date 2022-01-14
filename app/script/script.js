
function searchCountry(event) {
    let text = document.getElementsByTagName("input")[0].value;
    if (text !== "") {
        let filterText = text.toUpperCase();
        let countries = $(".countries-list").find(".country");
        countries.each(function() {
            $(this).removeClass("hidden");
            let name = $(this).find(".name");
            if (name.text().toUpperCase() !== filterText) {
                $(this).addClass("hidden");
            }
        });
    }
}

function resetList() {
    $(".filter").find("input").val("");
    let countries = $(".countries-list").find(".country");
    countries.each(function() {
        $(this).removeClass("hidden");
    });
}