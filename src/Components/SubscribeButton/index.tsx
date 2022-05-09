import { signIn, useSession } from 'next-auth/react';

import styles from './styles.module.scss'
import {stripe} from '../../services/stripe'

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtonProps) {

    const session = useSession();

    function handleSubscribe() {
        if(!session.data) {
            signIn('github');
            return;
        }

        // fazer requisição para a rota de subscribe
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            >
            Subscribe now
        </button>
    );
}