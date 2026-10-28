import type { ReactNode} from 'react';

type CardProps = {
    children: ReactNode;
};

export function Card({ children }: CardProps) {
    return (
        <div className="card">
            <div className="card-body">
            {children}
        </div>
        </div>
    );
}