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