
/**
 * Elegant showing of backend's dd() responses
 *
 * Props and thanks to Caleb Porzio and Jonathan Reinink
  */
let dd = {

    isOutputFromDump(output) {
        if (typeof output !== 'string') {
            return false
        }
        return !!output.match(/<script>Sfdump\(".+"\)<\/script>/)
    },

    showHtmlModal(html) {
        let page = document.createElement('html')
        page.innerHTML = html
        page.querySelectorAll('a').forEach(a =>
            a.setAttribute('target', '_top')
        )

        page.getElementsByTagName('head')[0].getElementsByTagName('style')[0].prepend(`
                .sf-dump-str {
                    font-size: 18px;
                }
            `)

        let modal
        if (typeof modal != 'undefined' && modal != null && modal.innerHTML && modal.innerHTML !== '')  {
            // Modal already exists.
            modal.innerHTML = ''
        } else {
            modal = document.createElement('div')
            modal.id = 'dd-modal-error'
            modal.style.position = 'fixed'
            modal.style.width = '100vw'
            modal.style.height = '100vh'
            modal.style.padding = '80px'
            modal.style.backgroundColor = 'rgba(0, 0, 0, .6)'
            modal.style.zIndex = '200000'
        }

        let iframe = document.createElement('iframe')
        iframe.style.backgroundColor = '#17161A'
        iframe.style.borderRadius = '5px'
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        modal.appendChild(iframe)

        document.body.prepend(modal)
        document.body.style.overflow = 'hidden'
        iframe.contentWindow.document.open()
        iframe.contentWindow.document.write(page.outerHTML)
        iframe.contentWindow.document.close()

        // Close on click.
        modal.addEventListener('click', () => this.hideHtmlModal(modal))

        // Close on escape key press.
        modal.setAttribute('tabindex', 0)
        modal.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.hideHtmlModal(modal)
        })
        modal.focus()
    },

    hideHtmlModal(modal) {
        modal.outerHTML = ''
        document.body.style.overflow = 'visible'
    },
}

export default dd
