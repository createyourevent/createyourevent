
import { transition } from '@angular/animations';
import React, { useState, useEffect } from 'react'
import Lightbox from '../../../content/scripts/Lightbox.js'

export interface IDatatransFormProps {
  production: boolean;
  transactionId: string;
  onLoaded: () => void;
  onOpened: () => void;
  onCancelled: () => void;
  onError: (data: string) => void
}


const Datatrans: React.FC<IDatatransFormProps> = ({production, transactionId, onLoaded, onOpened, onCancelled, onError}: IDatatransFormProps) => {
  const [lightbox, showLightbox] = useState(false)
  const [loading, setLoading] = useState(false)
  let [tId, setTId] = useState('')
  let [prod, setProd] = useState('')

  const onClick = () => {
    setLoading(true)
    showLightbox(true)
  }
  const onLoadedReact = () => {
    setLoading(false)
    onLoaded()
  }
  const onOpenedReact = () => {
    console.log('Opened')
    onOpened()
  }
  const onCancelledReact = () => {
    showLightbox(false)
    onCancelled()
  }
  const onErrorReact = (data) => {
    console.log('Error:', data)
    setLoading(false)
    showLightbox(false)
    onError(data)
  }

  useEffect(() => {
    if (transactionId) {
      setTId(transactionId)
    }
    if (production) {
      setProd(production)
    }
  }, [transactionId, production])

  return <div>

      {loading
        ? <span className='loader' />
        : <button className="datatrans_button" onClick={onClick} disabled={!tId}>Bezahlen</button>
      }
    {lightbox && tId && <Lightbox
        transactionId={tId}
        production={prod}
        onLoaded={onLoadedReact}
        onOpened={onOpenedReact}
        onCancelled={onCancelledReact}
        onError={onErrorReact}
      />
    }
</div>

}

export default Datatrans;
