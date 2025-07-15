$(document).ready(function() {
    // Toggle invoice_type_list on .allInvoiceBtn click
    $('.allInvoiceBtn').click(function(e) {
        e.stopPropagation(); // Prevent event from bubbling to document
        $('.invoice_type_list').slideToggle();
    });

    // Hide invoice_type_list when clicking outside (except .allInvoiceBtn)
    $(document).click(function(e) {
        if (!$(e.target).closest('.invoice_type_list').length && !$(e.target).closest('.allInvoiceBtn').length) {
            $('.invoice_type_list').slideUp();
        }
    });

    // Prevent closing when clicking inside invoice_type_list
    $('.invoice_type_list').click(function(e) {
        e.stopPropagation();
    });
});
$(document).ready(function() {
    // Select the input field and attach a keyup event handler
    $('.invoice_type_list input[type="search"]').on('keyup', function() {
        // Get the search term and convert to lowercase
        var searchTerm = $(this).val().toLowerCase();
        
        // Loop through each list item
        $('.invoice_type_list_items_area ul li').each(function() {
            // Get the text content of the button's span
            var itemText = $(this).find('button .content').text().toLowerCase();
            
            // Show/hide based on whether it matches the search term
            if (itemText.indexOf(searchTerm) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});