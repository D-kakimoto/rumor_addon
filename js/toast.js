//ページ読み込み時流言検出数をトーストで表示
function toast_on(count,string){
  $(document).ready(function() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    Command:toastr["success"](string, count+"件の流言を検出")
    $('#linkButton').click(function() {
      toastr.success('click');
    });
  });
}
