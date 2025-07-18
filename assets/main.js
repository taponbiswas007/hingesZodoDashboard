$(document).ready(function () {
    // Toggle invoice_type_list on .allInvoiceBtn click
    $('.allInvoiceBtn').click(function (e) {
        e.stopPropagation(); // Prevent event from bubbling to document
        $('.invoice_type_list').slideToggle();
    });

    // Hide invoice_type_list when clicking outside (except .allInvoiceBtn)
    $(document).click(function (e) {
        if (!$(e.target).closest('.invoice_type_list').length && !$(e.target).closest('.allInvoiceBtn').length) {
            $('.invoice_type_list').slideUp();
        }
    });

    // Prevent closing when clicking inside invoice_type_list
    $('.invoice_type_list').click(function (e) {
        e.stopPropagation();
    });
});



$(document).ready(function () {
    // Select the input field and attach a keyup event handler
    $('.invoice_type_list input[type="search"]').on('keyup', function () {
        // Get the search term and convert to lowercase
        var searchTerm = $(this).val().toLowerCase();

        // Loop through each list item
        $('.invoice_type_list_items_area ul li').each(function () {
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



$(document).ready(function () {
    // Select the input field and attach a keyup event handler
    $('.sortByList .dropdown-item').click(function () {
        $('.sortByList .dropdown-item').removeClass('active');
        $(this).addClass('active');
    });
});

// customize table
const allColumns = [
    'Order Number', 'Customer Name', 'Due Date', 'Balance', 'Shipping Charge', 'Shipping Address',
    'Country', 'Billing Address', 'CRM Potential Name', 'Company Name', 'Due Days', 'Adjustment',
    'Created By', 'Email', 'Expected Payment Date', 'Phone', 'Project Name', 'Sales Person', 'Sub Total'
];

const lockedColumns = ['Date', 'Invoice#', 'Invoice Status', 'Invoice Amount'];

// Load or initialize selected columns from localStorage
let selectedColumns = JSON.parse(localStorage.getItem('selectedInvoiceColumns')) || [
    'Order Number', 'Customer Name'
];

function renderColumnList(filter = '') {
    const container = $('#columnListContainer');
    container.empty();

    allColumns.forEach(col => {
        if (filter && !col.toLowerCase().includes(filter.toLowerCase())) return;

        const isChecked = selectedColumns.includes(col);
        const item = $(`
                <div class="customize-popup-list-item">
                    <div>
                        <input type="checkbox" class="form-check-input me-2 column-checkbox" data-column="${col}" ${isChecked ? 'checked' : ''}>
                        ${col}
                    </div>
                    <i class="fas fa-thumbtack pin-icon"></i>
                </div>
            `);
        container.append(item);
    });

    $('#checkedCount').text(selectedColumns.length);
}

function applyColumns() {
    const $theadRow = $('.invoice-table thead tr');
    const $tbodyRows = $('.invoice-table tbody tr');

    // Remove all previous dynamic columns
    $theadRow.find('th.dynamic-col').remove();
    $tbodyRows.find('td.dynamic-col').remove();

    // Add selected columns to thead
    selectedColumns.forEach(col => {
        $(`<th class="dynamic-col">${col}</th>`).insertBefore($theadRow.find('th').last());
    });

    // For demo purposes, append dummy data to tbody
    $tbodyRows.each(function (i, row) {
        selectedColumns.forEach((col, idx) => {
            let content = '-';
            if (col === 'Order Number') content = ['ORD-1234', 'ORD-5678', 'ORD-9999'][i] || '-';
            if (col === 'Customer Name') content = ['Acme Ltd', 'TechSoft', 'Xeno Corp'][i] || '-';
            $(row).find('td').eq(-1).before(`<td class="dynamic-col">${content}</td>`);
        });
    });
}



$(document).ready(function () {
    renderColumnList();
    applyColumns();

    $('#searchColumns').on('input', function () {
        renderColumnList($(this).val());
    });

    $(document).on('change', '.column-checkbox', function () {
        const column = $(this).data('column');
        if ($(this).is(':checked')) {
            if (!selectedColumns.includes(column)) selectedColumns.push(column);
        } else {
            selectedColumns = selectedColumns.filter(col => col !== column);
        }
        $('#checkedCount').text(selectedColumns.length);
    });

    $('#saveColumnsBtn').click(function () {
        const $btn = $(this);
        $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...');

        setTimeout(() => {
            localStorage.setItem('selectedInvoiceColumns', JSON.stringify(selectedColumns));
            applyColumns();
            $btn.prop('disabled', false).text('Save');
            $('#columnModal').modal('hide');
        }, 1000);
    });
});

function renderColumnList(filter = '') {
    const container = $('#columnListContainer');
    container.empty();

    let visibleCount = 0;

    allColumns.forEach(col => {
        if (filter && !col.toLowerCase().includes(filter.toLowerCase())) return;

        const isChecked = selectedColumns.includes(col);
        const item = $(`
            <div class="customize-popup-list-item">
                <div>
                    <input type="checkbox" class="form-check-input me-2 column-checkbox" data-column="${col}" ${isChecked ? 'checked' : ''}>
                    ${col}
                </div>
                <i class="fas fa-thumbtack pin-icon"></i>
            </div>
        `);
        container.append(item);
        visibleCount++;
    });

    $('#checkedCount').text(selectedColumns.length);
    $('#totalCount').text(allColumns.length);
}


// paginate area start
let totalItems = 83; // Example total from backend
let currentPageSize = 25;

function updatePaginationInfo() {
    const start = 1;
    const end = Math.min(currentPageSize, totalItems);
    $('#paginationInfo').text(`Showing ${start}–${end} of ${totalItems} items`);
}

updatePaginationInfo();

// Filter page size list based on search input
$('#pageSizeSearch').on('input', function () {
    const query = $(this).val().toLowerCase();
    $('.page-size-option').each(function () {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(query));
    });
});

// Handle page size change
$('.page-size-option').click(function (e) {
    e.preventDefault();
    currentPageSize = parseInt($(this).data('size'));
    $('#currentPageSizeLabel').text(`${currentPageSize} per page`);
    updatePaginationInfo();

    // Optional: Load new data here based on selected size
});



$(document).ready(function () {
    // CUSTOMER DROPDOWN
    $('#selectedCustomerInput, .customer-dropdown-toggle').on('click', function (e) {
        e.stopPropagation();
        $('#customerDropdown').toggleClass('d-none');
        $('#customerSearchInput').focus();
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#customerDropdown').length && !$(e.target).is('#selectedCustomerInput')) {
            $('#customerDropdown').addClass('d-none');
        }
    });

    $('#customerSearchInput').on('input', function () {
        const value = $(this).val().toLowerCase();
        $('#customerList li').each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    $('.customer-item').on('click', function () {
        const name = $(this).find('.customerName').text().trim();
        $('#selectedCustomerInput').val(name);
        $('#customerDropdown').addClass('d-none');
    });

});



$(document).ready(function () {
    // TERMS DROPDOWN
    $('#termsSelectInput').on('click', function (e) {
        e.stopPropagation();
        $('#termsDropdown').toggleClass('d-none');
        $('#termsSearchInput').focus();
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#termsDropdown').length) {
            $('#termsDropdown').addClass('d-none');
        }
    });

    $('#termsSearchInput').on('input', function () {
        const value = $(this).val().toLowerCase();
        $('#termsList li').each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    $('.term-item').on('click', function () {
        $('.term-item').removeClass('selected');
        $(this).addClass('selected');

        const selectedText = $(this).text().trim();
        const selectedId = $(this).data('id');

        $('#termsSelectInput').val(selectedText);
        $('#selectedTermId').val(selectedId);
        $('#termsDropdown').addClass('d-none');
    });
});


$(document).ready(function () {
    // SALESPERSON DROPDOWN
    $('#salesPersonSelectInput').on('click', function (e) {
        e.stopPropagation();
        $('#salesPersonDropdown').toggleClass('d-none');
        $('#salesPersonSearchInput').focus();
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#salesPersonDropdown').length) {
            $('#salesPersonDropdown').addClass('d-none');
        }
    });

    $('#salesPersonSearchInput').on('input', function () {
        const value = $(this).val().toLowerCase();
        $('#salesPersonList li').each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    $('.salesperson-item').on('click', function () {
        $('.salesperson-item').removeClass('selected');
        $(this).addClass('selected');

        const name = $(this).text().trim();
        const id = $(this).data('id');

        $('#salesPersonSelectInput').val(name);
        $('#selectedSalesPersonId').val(id);
        $('#salesPersonDropdown').addClass('d-none');
    });
});



$(document).ready(function () {
    // PRODUCT DROPDOWN
    $(document).on('click', '.product-input', function (e) {
        e.stopPropagation();
        $('.product-dropdown').addClass('d-none');

        const wrapper = $(this).closest('.product-input-wrapper');
        wrapper.find('.product-dropdown').removeClass('d-none');
        wrapper.find('.product-search-box').val('').focus();

        wrapper.find('.product-list li').show();
    });

    $(document).on('click', function () {
        $('.product-dropdown').addClass('d-none');
    });

    $(document).on('input', '.product-search-box', function () {
        const value = $(this).val().toLowerCase();
        const listItems = $(this).closest('.product-dropdown').find('.product-item');

        listItems.each(function () {
            const text = $(this).text().toLowerCase();
            $(this).closest('li').toggle(text.includes(value));
        });
    });

    $(document).on('click', '.product-item', function () {
        const productName = $(this).find('h1').text().trim();
        const productId = $(this).data('id');

        const wrapper = $(this).closest('.product-input-wrapper');
        wrapper.find('.product-input').val(productName);
        wrapper.find('.product-id-input').val(productId);

        wrapper.find('.product-dropdown').addClass('d-none');
    });
});


$(document).ready(function () {
    $('.stockDetailsBtn').click(function () {
        $('.stockDetails_popup').show();
    });
    $('.stockDetails_popupClose').click(function () {
        $('.stockDetails_popup').hide();
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});


$(document).ready(function () {
    $('.addNewSalesperson').click(function () {
        $('.new_salespersonAdd_area').show();
        $('.searchandSalesperson_area').hide();
    });
    $('.cancelAddperson').click(function () {
        $('.new_salespersonAdd_area').hide();
        $('.searchandSalesperson_area').show();
    });

});



$(document).ready(function () {
    // Toggle dropdown
    $('#priceListInput').on('click', function (e) {
        e.stopPropagation();
        $('#priceListDropdown').toggleClass('d-none');
        $('#priceListSearch').val('').focus();
        $('#priceListItems li').show();
    });

    // Hide on outside click
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.priceList').length) {
            $('#priceListDropdown').addClass('d-none');
        }
    });

    // Search filter
    $('#priceListSearch').on('input', function () {
        const value = $(this).val().toLowerCase();
        $('#priceListItems li').each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    // Select item
    $('.price-item').on('click', function () {
        const name = $(this).text().trim();
        const id = $(this).data('id');

        $('#priceListInput').val(name);
        $('#selectedPriceId').val(id);
        $('#clearPriceList').removeClass('d-none');
        $('#priceListDropdown').addClass('d-none');
    });

    // Clear selected item
    $('#clearPriceList').on('click', function () {
        $('#priceListInput').val('');
        $('#selectedPriceId').val('');
        $(this).addClass('d-none');
    });

    // 🔄 Show X if value already selected (on refresh/page load)
    if ($('#priceListInput').val().trim() !== '') {
        $('#clearPriceList').removeClass('d-none');
    }
});



$(document).ready(function () {
    $('.items_and_transaction_tabs_area button').click(function () {
        $('.items_and_transaction_tabs_area button').removeClass('active');
        $(this).addClass('active');
    });

});


$(document).ready(function () {
    $('#itemsDetails').click(function () {
        $('.items_details_area').show();
        $('.transaction_details_area').hide();
    });
    $('#transactionDetails').click(function () {
        $('.items_details_area').hide();
        $('.transaction_details_area').show();
    });
});


// Handle row click to go to invoice detail
$('.invoice-table tbody').on('click', 'tr', function () {
    const invoiceId = $(this).data('id');
    if (invoiceId) {
        // window.location.href = `showInvoice-${invoiceId}.html`;
        window.location.href = `showInvoice.html`;

    }
});
