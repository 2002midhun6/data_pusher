import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Account
from destinations.models import Destination
@api_view(['POST'])
def incoming_data(request):

    # 1. Check secret token
    token = request.headers.get('CL-X-TOKEN')
    if not token:
        return Response(
            {"error": "Un Authenticate"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # 2. Check JSON data
    if not isinstance(request.data, dict):
        return Response(
            {"error": "Invalid Data"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 3. Identify account
    try:
        account = Account.objects.get(app_secret_token=token)
    except Account.DoesNotExist:
        return Response(
            {"error": "Un Authenticate"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # 4. Get destinations
    destinations = account.destinations.all()

    # 5. Send data to destinations
    for dest in destinations:
        try:
            if dest.http_method == 'GET':
                requests.get(
                    dest.url,
                    params=request.data,
                    headers=dest.headers,
                    timeout=5
                )
            elif dest.http_method == 'POST':
                requests.post(
                    dest.url,
                    json=request.data,
                    headers=dest.headers,
                    timeout=5
                )
            elif dest.http_method == 'PUT':
                requests.put(
                    dest.url,
                    json=request.data,
                    headers=dest.headers,
                    timeout=5
                )
        except requests.RequestException:
            # Ignore individual destination failures
            continue

    return Response(
        {"message": "Data forwarded successfully"},
        status=status.HTTP_200_OK
    )
