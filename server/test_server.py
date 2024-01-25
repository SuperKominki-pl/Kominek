import json
import unittest
from sqlalchemy.orm import scoped_session, sessionmaker
from server import app, db, Fireplace


class FlaskAppTests(unittest.TestCase):

    def setUp(self):
        # Konfiguracja testowej bazy danych
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        app.config['TESTING'] = True
        self.app = app.test_client()
        with app.app_context():
            db.create_all()
            db.session = scoped_session(sessionmaker(bind=db.engine), scopefunc=app.app_context)

    def tearDown(self):
        # Czyszczenie bazy danych po zakończeniu testów
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_info(self):
        # Test funkcji get_info
        with app.app_context():
            # Dodaj przykładowy kominek do bazy danych
            fireplace = Fireplace(
                temperature=22.5,
                color='#FF0000',
                mode='normal',
                status=True
            )
            db.session.add(fireplace)
            db.session.commit()

            # Wykonaj żądanie GET do endpointu /info/<id>
            response = self.app.get('/info/1')

            # Sprawdź, czy otrzymujemy poprawne dane
            if response.status_code == 200:
                data = json.loads(response.get_data(as_text=True))
                self.assertEqual(data['id'], 1)
                self.assertEqual(data['temperature'], 22.5)
                self.assertEqual(data['color'], '#FF0000')
                self.assertEqual(data['mode'], 'normal')
                self.assertEqual(data['status'], 'On')
            elif response.status_code == 404:
                # Możesz tutaj obsłużyć brak danych, jeśli to jest oczekiwane
                pass
            else:
                # Obsłuż inne kody odpowiedzi, jeśli to konieczne
                self.fail(f"Unexpected status code: {response.status_code}")

    def test_change_temperature(self):
        # Test funkcji change_temperature
        with app.app_context():
            # Dodaj przykładowy kominek do bazy danych
            fireplace = Fireplace(
                temperature=22.5,
                color='#FF0000',
                mode='normal',
                status=True
            )
            db.session.add(fireplace)
            db.session.commit()

            # Wykonaj żądanie POST do endpointu /change_temperature/<id>
            data = {'temperature': 25.0}
            response = self.app.post('/change_temperature/1', json=data)

            # Sprawdź, czy temperatura została zmieniona
            if response.status_code == 200:
                updated_fireplace = Fireplace.query.get(1)
                self.assertEqual(updated_fireplace.temperature, 25.0)
            elif response.status_code == 404:
                # Możesz tutaj obsłużyć brak danych, jeśli to jest oczekiwane
                pass
            else:
                # Obsłuż inne kody odpowiedzi, jeśli to konieczne
                self.fail(f"Unexpected status code: {response.status_code}")

    def test_add_fireplace(self):
        # Test funkcji add_fireplace
        with app.app_context():
            # Wykonaj żądanie POST do endpointu /add_fireplace
            data = {'temperature': 22.5, 'color': '#00FF00', 'mode': 'eco', 'status': True}
            response = self.app.post('/add_fireplace', json=data)

            # Sprawdź, czy kominek został dodany do bazy danych
            if response.status_code == 201:
                new_fireplace = Fireplace.query.get(1)
                self.assertIsNotNone(new_fireplace)
                self.assertEqual(new_fireplace.temperature, 22.5)
                self.assertEqual(new_fireplace.color, '#00FF00')
                self.assertEqual(new_fireplace.mode, 'eco')
                self.assertEqual(new_fireplace.status, True)
            elif response.status_code == 404:
                # Możesz tutaj obsłużyć brak danych, jeśli to jest oczekiwane
                pass
            else:
                # Obsłuż inne kody odpowiedzi, jeśli to konieczne
                self.fail(f"Unexpected status code: {response.status_code}")


if __name__ == '__main__':
    unittest.main()
