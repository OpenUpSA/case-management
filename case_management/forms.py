from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from case_management.models import User


class UserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ('email',)
        password = ReadOnlyPasswordHashField()


class UserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ('email',)
        password = ReadOnlyPasswordHashField()