module.exports = (UrlTrueWallet, PhoneNumber) => new Promise(resolve => {
    let UrlTrueWalletFull = 'https://gift.truemoney.com/campaign/';
    let UrlTrueWalletReplace = UrlTrueWallet.replace(UrlTrueWalletFull + '?v=', "");
    require('request').post({
        url: UrlTrueWalletFull + 'vouchers/' + UrlTrueWalletReplace + '/redeem',
        json: true,
        body: ({
            "mobile": PhoneNumber
        })
    }, (error, response, data) => {
        resolve(data);
    })
})